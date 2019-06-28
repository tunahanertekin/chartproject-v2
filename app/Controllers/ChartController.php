<?php

namespace App\Controllers;

use PDO;
use App\Models\JotForm;
use Interop\Container\ContainerInterface;


class ChartController{

    protected $jotformAPI;
    public $form;
    public $submissions;
    public $c;

    public function __construct(ContainerInterface $c){
        $this->c = $c;
        $this->jotformAPI = new JotForm("286dec88b006d9221daf40d94278c162");

        $forms = $this->jotformAPI->getForms();
       
        foreach($forms as $f){
            if($f["title"] == "Test2"){
                $this->form = $f;
            }
        }
       
        $this->submissions = $this->jotformAPI->getFormSubmissions($this->form["id"]);
    }

    public function questionChoice($request,$response,$args){
        $questions = $this->jotformAPI->getFormQuestions($this->form["id"]);
        
        $infoArr = array();

        foreach($questions as $q){
            if($q["type"] == "control_checkbox"){
                array_push($infoArr,array($q["qid"],$q["text"]));
            }
        }


        return $this->c->view->render($response,"designed/choice_page.twig",compact("infoArr"));
    }

    public function index($request,$response,$args){
        
        $qid = $request->getParam("question");
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);

        $submissionArr = array();

        foreach($this->submissions as $s){
            array_push($submissionArr,array($s["created_at"],$s["answers"][$qid]["answer"],$s["id"]));
        }

        $question = array($questionJSON["qid"],$questionJSON["text"],$this->giveOptionsArray($questionJSON["options"]));
        
        return $this->c->view->render($response,"designed/index.twig",compact("submissionArr","question"));
    }

    public function giveOptionsArray($str){
        $options = array();
        $token = strtok($str,"|");

        while ($token !== false)
        {
            array_push($options,$token);
            $token = strtok("|");
        }

        return $options;
    }

}
