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
            if($f["title"] == "Job Application"){
                $this->form = $f;
            }
        }

       
        $this->submissions = $this->jotformAPI->getFormSubmissions($this->form["id"]);

    }

    public function questionChoice($request,$response,$args){
        $questions = $this->jotformAPI->getFormQuestions($this->form["id"]);
        
        $infoArr = array();
        $allQuestions = array();

        foreach($questions as $q){
            if($q["type"] == "control_checkbox"){
                array_push($infoArr,array($q["qid"],$q["text"]));
            }
            if($q["type"] != "control_button" && $q["type"] != "control_head"){
                array_push($allQuestions,array($q["qid"],$q["text"]));
            }
        }

        return $this->c->view->render($response,"designed/choice_page.twig",compact("infoArr","allQuestions"));
    }

    public function index($request,$response,$args){
        
        $qid = $args["mcq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);

        $submissionArr = array();

        foreach($this->submissions as $s){
            array_push($submissionArr,array($s["created_at"],$s["answers"][$qid]["answer"],$s["id"]));
        }

        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));
        return $this->c->view->render($response,"designed/index.twig",compact("submissionArr","question"));
    }

    public function timeBasis($request,$response,$args){
        
        $qid = $args["mcq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);

        $submissionArr = array();

        foreach($this->submissions as $s){
            array_push($submissionArr,array($s["created_at"],$s["answers"][$qid]["answer"],$s["id"]));
        }

        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));
        
        return $this->c->view->render($response,"designed/time_basis.twig",compact("question","submissionArr"));
    }

    public function relatedStats($request,$response,$args){

        $qid = $args["mcq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);

        $questionNumber = sizeof($this->jotformAPI->getFormQuestions($this->form["id"]));

        $otherQid = $args["oq"];
        $otherQuestionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$otherQid);

        $otherQuestionType = $otherQuestionJSON["type"];

        $submissionArr = $this->getAuxSubmissionArr($qid,$otherQid);

        $formID = $this->form["id"];

        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));
        $otherQuestion = array($otherQuestionJSON["qid"],str_ireplace("'","",$otherQuestionJSON["text"]),$otherQuestionJSON["type"]);

        return $this->c->view->render($response,"designed/related_stats.twig",compact("submissionArr","question","otherQuestion","formID"));
    }

    public function getAuxSubmissionArr($mcQid,$otherQid){
        $compactArr = array();
        /*
            It is convenient for 
            all basic form elements.

            ***Problem with apostrophe in JSON parsing!
        */
        
        foreach($this->submissions as $s){
            if(array_key_exists("answer",$s["answers"][$otherQid])){
                echo "hey";
                if(array_key_exists("answer",$s["answers"][$mcQid])){
                    $s["answers"][$otherQid]["answer"] = str_ireplace("'","",$s["answers"][$otherQid]["answer"]);
                    array_push($compactArr,array($s["created_at"],$s["answers"][$mcQid]["answer"],$s["answers"][$otherQid]["answer"],$s["id"]));
                }
                    
                else{
                    $s["answers"][$otherQid]["answer"] = str_ireplace("'","",$s["answers"][$otherQid]["answer"]);
                    array_push($compactArr,array($s["created_at"],array(),$s["answers"][$otherQid]["answer"],$s["id"]));
                }
                    
            }
        }
       
        return $compactArr;
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
