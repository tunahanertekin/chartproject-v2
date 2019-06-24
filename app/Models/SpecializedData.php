<?php

namespace App\Models;

use App\Models\JotForm;
use App\Models\MultipleChoices;

use Interop\Container\ContainerInterface;

class SpecializedData{

    public $c;
    public $jotformAPI;
    public $form;
    public $obj;
    public $submissions;

    public function __construct(ContainerInterface $c){
        $this->c = $c;
        $this->jotformAPI = new JotForm("286dec88b006d9221daf40d94278c162");
        $this->obj = new MultipleChoices($this->c);

        $forms = $this->jotformAPI->getForms();
       
        foreach($forms as $f){
            if($f["title"] == "Test"){
                $this->form = $f;
            }
        }
       
        $this->submissions = $this->jotformAPI->getFormSubmissions($this->form["id"]);
        //$form = $forms[1];
    }

    public function index($request,$response,$args){

        $multipleChoiceQuestions = $this->detectMultipleChoices();

        return $this->c->view->render($response,"specialized/index.twig",compact("multipleChoiceQuestions","questionIDArr"));
    }


    public function detectMultipleChoices(){
        $questions = $this->jotformAPI->getFormQuestions($this->form["id"]);
        
        $multiple = array();
        foreach($questions as $q){
            if($q["type"] == "control_checkbox"){
                $multiple[$q["qid"]] = $q["text"];
            }
        }

        return $multiple;
    }

    public function otherQuestions($request,$response,$args){
        
        $answer = $request->getParam("mcquestion");
        $qid = (int)substr($answer,9);

        $question = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);

        $questionInfo = array();

        $options = $this->obj->giveOptionsArray($question["options"]);

        foreach($options as $o){
            $questionInfo[$question["text"]][$o]=0;
        }

        
        foreach($this->submissions as $sub){
            if(!array_key_exists("answer",$sub["answers"][$qid])){
                continue;
            }
            else{
                $answers = $sub["answers"][$qid]["answer"];
                foreach($answers as $a){
                    $questionInfo[$question["text"]][$a]++;
                }
            }
        }
        
        $otherQuestions = $this->getAllOtherQuestions();

        $questionData = array(
            $qid,
            $questionInfo,
            $otherQuestions
        );

        return $this->c->view->render($response,"specialized/main.twig",compact("questionData"));
    }

    public function getAllOtherQuestions(){
        $questions = $this->jotformAPI->getFormQuestions($this->form["id"]);

        $questionSelect = array();

        $availableQuestionFormats = array(
            "control_textbox",
            "control_textarea",
            "control_dropdown",
            "control_radio",
            "control_checkbox",
            "control_number",
            "control_fullname",
            "control_email",
            "control_address",
            "control_phone"
        );

        foreach($questions as $q){
            if(!in_array($q["type"],$availableQuestionFormats)){
                continue;
            }
            else{
                $questionSelect[$q["qid"]] = $q["text"];
            }
        }

        return $questionSelect;
    }

    public function dynamicStats($request,$response,$args){
        return "Veeery dynamic baby..";
    }
}