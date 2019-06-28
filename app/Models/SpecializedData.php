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

        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);

        $optionFilter = false;
        $dateFilter = false;
        $targetQuestionID = "";
        
        $optionFilterArr = array();
        foreach($_POST as $k=>$p){
            if(substr($k,0,5) == "check"){
                $optionFilter = true;
                array_push($optionFilterArr,str_ireplace("_"," ",substr($k,5)));
            }
        }

        $dateFilterArr = array();
        if(!empty($request->getParam("fromDate")) && !empty($request->getParam("toDate"))){
            $dateFilter = true;
            $fromDate = $request->getParam("fromDate");
            $toDate = $request->getParam("toDate");
            $dateFilterArr = array($fromDate,$toDate);
        }
        
        $targetQuestionID = substr($request->getParam("otherQuestion"),5);

        $filters = array($optionFilter,$dateFilter);
        $data = array($optionFilterArr,$dateFilterArr);

        $dataForDifferentTypes = $this->fetchTargetQuestion(array($filters,$data,$targetQuestionID),$args);
        
        //BREAKPOINT
        $qid = $args["qid"];

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

        $compactData = array(
            
            $qid,
            $questionInfo,
            $otherQuestions,
            $dataForDifferentTypes
            
        );

        return $this->c->view->render($response,"specialized/result.twig",compact("compactData"));
    }

    public function fetchTargetQuestion($variables,$args){
        
        $filters = $variables[0];
        $data = $variables[1];
        $targetQuestionID = $variables[2];

        $currentQuestionID = $args["qid"];
        
        $targetQuestion = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID);

        $targetQuestionType = $targetQuestion["type"];

        $submissions = $this->jotformAPI->getFormSubmissions($this->form["id"]);

        $validSubmissions = array();
        foreach($submissions as $s){
            $push1 = true;
            $push2 = true;

            if($filters[0]){
                $optionFilterArr = $data[0];
                
                if(!array_key_exists("answer",$s["answers"][$currentQuestionID])){
                    continue;
                }
                else{
                    $answerArr = $s["answers"][$currentQuestionID]["answer"];

                    foreach($optionFilterArr as $o){
                        if(!in_array($o,$answerArr)){
                            $push1 = false;
                        }
                    }
                }
                if($push1 == false){
                        continue;
                }
            }

            if($filters[1]){
                $dateFilterArr = $data[1];

                $fromDate = strtotime($dateFilterArr[0]);
                $toDate = strtotime($dateFilterArr[1]);

                $subDate = strtotime($s["created_at"]);

                if(!($fromDate<$subDate && $subDate<$toDate)){
                    $push2 = false;
                }

                if($push2 == false){
                    continue;
                }
            }

            array_push($validSubmissions,$s);
        }

        if($targetQuestionType == "control_textbox"){
            return $this->getTextboxStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        else if($targetQuestionType == "control_textarea"){
            return $this->getTextareaStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        else if($targetQuestionType == "control_dropdown"){
            return $this->getDropdownStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        else if($targetQuestionType == "control_radio"){
            return $this->getRadioStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        else if($targetQuestionType == "control_checkbox"){
            return $this->getCheckboxStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        else if($targetQuestionType == "control_number"){
            return $this->getNumberStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        else if($targetQuestionType == "control_fullname"){
            return $this->getFullnameStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        else if($targetQuestionType == "control_email"){
            return $this->getEmailStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        else if($targetQuestionType == "control_address"){
            return $this->getAddressStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        else if($targetQuestionType == "control_phone"){
            return $this->getPhoneStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data);
        }
        
    }

    public function getTextboxStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //text list table
        $textArr = array();
        foreach($validSubmissions as $v){
            if(array_key_exists("answer",$v["answers"][$targetQuestionID]))
                array_push($textArr,$v["answers"][$targetQuestionID]["answer"]);
        }

        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        return array($targetQuestionType,$targetQuestionName,$textArr,$filters,$data);
    }

    public function getTextAreaStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //text list table
        $textArr = array();
        foreach($validSubmissions as $v){
            if(array_key_exists("answer",$v["answers"][$targetQuestionID]))
                array_push($textArr,$v["answers"][$targetQuestionID]["answer"]);
        }

        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        return array($targetQuestionType,$targetQuestionName,$textArr,$filters,$data);
    }

    public function getDropdownStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //text list with values
        $textArr = array();

        foreach($validSubmissions as $v){
            if(array_key_exists("answer",$v["answers"][$targetQuestionID]))
                array_push($textArr,$v["answers"][$targetQuestionID]["answer"]);
        }
 
        $dropdownStat = array();
        foreach(array_unique($textArr) as $t){
            $dropdownStat[$t]=0;
        }

        foreach($dropdownStat as $d=>$v){
            foreach($textArr as $t){
                if($t == $d){
                    $dropdownStat[$d]++;
                }
            }
        }
         
        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        return array($targetQuestionType,$targetQuestionName,$dropdownStat,$filters,$data);
    }

    public function getRadioStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //text list with values

        $textArr = array();
        foreach($validSubmissions as $v){
            if(array_key_exists("answer",$v["answers"][$targetQuestionID]))
                array_push($textArr,$v["answers"][$targetQuestionID]["answer"]);
        }
 
        $radioStat = array();
        foreach(array_unique($textArr) as $t){
            $radioStat[$t]=0;
        }

        foreach($radioStat as $d=>$v){
            foreach($textArr as $t){
                if($t == $d){
                    $radioStat[$d]++;
                }
            }
        }
         
        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        

        return array($targetQuestionType,$targetQuestionName,$radioStat,$filters,$data);
    }

    public function getCheckboxStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //option list with values

        $targetQuestion = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID);
        $options = $this->obj->giveOptionsArray($targetQuestion["options"]);

        $mcdata = array();

        
        foreach($options as $o){
            if(!in_array($o,$data[0]))
                $mcdata[$o]=0;
        }

    
        foreach($validSubmissions as $v){
            if(array_key_exists("answer",$v["answers"][$targetQuestionID]))
                $currentAnswer = $v["answers"][$targetQuestionID]["answer"];
            else
                continue;

            foreach($currentAnswer as $c){
                if(array_key_exists($c,$mcdata)){
                    $mcdata[$c]++;
                }
            }
        }

        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        return array($targetQuestionType,$targetQuestionName,$mcdata,$filters,$data);
    }

    public function getNumberStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //number list table
        $numArr = array();
        foreach($validSubmissions as $v){
            if(array_key_exists("answer",$v["answers"][$targetQuestionID]))
                array_push($numArr,$v["answers"][$targetQuestionID]["answer"]);
        }

        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        return array($targetQuestionType,$targetQuestionName,$numArr,$filters,$data);
    }

    public function getFullnameStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //name list table
        $nameArr = array();
        foreach($validSubmissions as $v){
            if(array_key_exists("answer",$v["answers"][$targetQuestionID]))
                array_push($nameArr,$v["answers"][$targetQuestionID]["answer"]);
        }

        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        return array($targetQuestionType,$targetQuestionName,$nameArr,$filters,$data);
    }

    public function getEmailStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //mail list table
        $emailArr = array();
        foreach($validSubmissions as $v){
            if(array_key_exists("answer",$v["answers"][$targetQuestionID]))
                array_push($emailArr,$v["answers"][$targetQuestionID]["answer"]);
        }

        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        return array($targetQuestionType,$targetQuestionName,$emailArr,$filters,$data);
    }

    public function getAddressStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //address list table
        $addressArr = array();

        foreach($validSubmissions as $v){

            if(array_key_exists("prettyFormat",$v["answers"][$targetQuestionID]))
                array_push($addressArr,$v["answers"][$targetQuestionID]["prettyFormat"]);
        }

        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        

        return array($targetQuestionType,$targetQuestionName,$addressArr,$filters,$data);
    }

    public function getPhoneStat($validSubmissions,$targetQuestionType,$targetQuestionID,$filters,$data){
        //phone list table
        $phoneArr = array();

        foreach($validSubmissions as $v){

            if(array_key_exists("prettyFormat",$v["answers"][$targetQuestionID]))
                array_push($phoneArr,$v["answers"][$targetQuestionID]["prettyFormat"]);
        }

        $targetQuestionName = $this->jotformAPI->getFormQuestion($this->form["id"],$targetQuestionID)["text"];

        return array($targetQuestionType,$targetQuestionName,$phoneArr,$filters,$data);
    }
}