<?php

namespace App\Controllers;

use PDO;
use App\Models\JotForm;
use Interop\Container\ContainerInterface;

/*
form ve submissions her seferinde API'den alınıyor, problem.
*/

/*
Function Design:
--Catch and assign
--Create an information format
--Send it to frontend.
*/

class ChartController{

    protected $jotformAPI; //API connection variable
    public $form; //Form choosed
    public $submissions; //Submissions of form
    public $c; //Container variable

    public function __construct(ContainerInterface $c){
        $this->c = $c;
        $this->jotformAPI = new JotForm("286dec88b006d9221daf40d94278c162");
    }

    
    /*
    * For every request, data is received from API.
    */
    public function setFormAndSubmissions($id){
        $this->form = $this->jotformAPI->getForm($id);
        $this->submissions = $this->jotformAPI->getFormSubmissions($id);
    }

    /*
    * User must choose a form. Lists all forms.
    */
    public function formChoice($request,$response,$args){
        $forms = $this->jotformAPI->getForms();
        
        $formArr = array();
        foreach($forms as $f){
            array_push($formArr,array($f["id"],$f["title"],$f["count"],$f["updated_at"]));
        }

        return $this->c->view->render($response,"designed/form_choice.twig",compact("formArr"));
    }

    /*
    * Three stat-format is available. This route/function shows all formats to user and receive an answer.
    * User chooses what type of stats will be shown and selects the question/s.
    */
    public function questionChoice($request,$response,$args){
        
        $formID = $args["formID"];
        $this->setFormAndSubmissions($formID);
        $formName = $this->jotformAPI->getForm($formID)["title"];
        $questions = $this->jotformAPI->getFormQuestions($this->form["id"]);
        
        $singleChoiceQuestions = array();
        $dropdownQuestions = array();
        $infoArr = array();
        $allQuestions = array();
        foreach($questions as $q){
            if($q["type"] == "control_radio"){
                array_push($singleChoiceQuestions,array($q["qid"],$q["text"]));
            }
            if($q["type"] == "control_dropdown"){
                array_push($dropdownQuestions,array($q["qid"],$q["text"]));
            }
            if($q["type"] == "control_checkbox"){
                array_push($infoArr,array($q["qid"],$q["text"]));
            }
            if($q["type"] != "control_button" && $q["type"] != "control_head"){
                array_push($allQuestions,array($q["qid"],$q["text"]));
            }
        }

        

        return $this->c->view->render($response,"designed/choice_page.twig",compact("infoArr","allQuestions","singleChoiceQuestions","dropdownQuestions","formID","formName"));
    }

    /*
    * Simple pie chart and radar chart is shown. 
    * Features are explained.
    */
    public function index($request,$response,$args){
        
        $formID = $args["formID"];
        $this->setFormAndSubmissions($formID);
        $qid = $args["mcq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);
        
        $submissionArr = array();
        foreach($this->submissions as $s){
            array_push($submissionArr,array($s["created_at"],$s["answers"][$qid]["answer"],$s["id"]));
        }
        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));
        
        return $this->c->view->render($response,"designed/index.twig",compact("submissionArr","question"));
    }

    public function radioIndex($request,$response,$args){

        $formID = $args["formID"];
        $this->setFormAndSubmissions($formID);
        $qid = $args["scq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);

        $submissionArr = array();
        foreach($this->submissions as $s){
            array_push($submissionArr,array($s["created_at"],$s["answers"][$qid]["answer"],$s["id"]));
        }
        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));

        return $this->c->view->render($response, "designed/radio/radio_index.twig",compact("question","submissionArr"));
    }

    public function dropdownIndex($request,$response,$args){
        $formID = $args["formID"];
        $this->setFormAndSubmissions($formID);
        $qid = $args["ddq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);

        $submissionArr = array();
        foreach($this->submissions as $s){
            array_push($submissionArr,array($s["created_at"],$s["answers"][$qid]["answer"],$s["id"]));
        }
        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));

        return $this->c->view->render($response, "designed/dropdown/dropdown_index.twig",compact("question","submissionArr"));
    }

    /*
    * Sends the submission data to frontend, then filter it with JS. Time periods are compared.
    */
    public function timeBasis($request,$response,$args){
        
        $formID = $args["formID"];
        $this->setFormAndSubmissions($formID);
        $qid = $args["mcq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);

        $submissionArr = array();
        foreach($this->submissions as $s){
            array_push($submissionArr,array($s["created_at"],$s["answers"][$qid]["answer"],$s["id"]));
        }
        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));
        
        return $this->c->view->render($response,"designed/time_basis.twig",compact("question","submissionArr"));
    }

    public function radioTimeBasis($request,$response,$args){
        return $this->c->view->render($response, "designed/radio/radio_time.twig");
    }

    /*
    * This feature is for every basic form elements. Scoped for MC question, other questions' stats are shown
    * with charts and tables.
    */
    public function relatedStats($request,$response,$args){
        
        $formID = $args["formID"];
        $this->setFormAndSubmissions($formID);
        $questions = $this->jotformAPI->getFormQuestions($formID);
        $qid = $args["mcq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);
        $questionNumber = sizeof($this->jotformAPI->getFormQuestions($this->form["id"]));
        $otherQid = $args["oq"];
        $otherQuestionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$otherQid);
        $otherQuestionType = $otherQuestionJSON["type"];

        $mcQuestions = array();
        $allQuestions = array();
        foreach($questions as $q){
            if($q["type"] == "control_checkbox"){
                array_push($mcQuestions,array($q["qid"],$q["text"]));
            }
            if($q["type"] != "control_button" && $q["type"] != "control_head"){
                array_push($allQuestions,array($q["qid"],$q["text"]));
            }
        }

        $submissionArr = $this->getAuxSubmisionArrays($qid,$otherQid);
        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));
        $otherQuestion = array($otherQuestionJSON["qid"],str_ireplace("'","",$otherQuestionJSON["text"]),$otherQuestionJSON["type"]);

        return $this->c->view->render($response,"designed/related_stats.twig",compact("mcQuestions","allQuestions","submissionArr","question","otherQuestion","formID"));
    }

    public function radioRelatedStats($request,$response,$args){
        $formID = $args["formID"];
        $this->setFormAndSubmissions($formID);
        $questions = $this->jotformAPI->getFormQuestions($formID);
        $qid = $args["scq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);
        $questionNumber = sizeof($this->jotformAPI->getFormQuestions($this->form["id"]));
        $otherQid = $args["oq"];
        $otherQuestionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$otherQid);
        $otherQuestionType = $otherQuestionJSON["type"];

        $scQuestions = array();
        $allQuestions = array();
        foreach($questions as $q){
            if($q["type"] == "control_radio"){
                array_push($scQuestions,array($q["qid"],$q["text"]));
            }
            if($q["type"] != "control_button" && $q["type"] != "control_head"){
                array_push($allQuestions,array($q["qid"],$q["text"]));
            }
        }

        $submissionArr = $this->getAuxSubmisionArrays($qid,$otherQid);
        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));
        $otherQuestion = array($otherQuestionJSON["qid"],str_ireplace("'","",$otherQuestionJSON["text"]),$otherQuestionJSON["type"]);

        return $this->c->view->render($response, "designed/radio/radio_related.twig", compact("scQuestions","allQuestions","submissionArr","question","otherQuestion","formID"));
    }

    public function dropdownRelatedStats($request,$response,$args){
        $formID = $args["formID"];
        $this->setFormAndSubmissions($formID);
        $questions = $this->jotformAPI->getFormQuestions($formID);
        $qid = $args["ddq"];
        $questionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$qid);
        $questionNumber = sizeof($this->jotformAPI->getFormQuestions($this->form["id"]));
        $otherQid = $args["oq"];
        $otherQuestionJSON = $this->jotformAPI->getFormQuestion($this->form["id"],$otherQid);
        $otherQuestionType = $otherQuestionJSON["type"];

        $ddQuestions = array();
        $allQuestions = array();
        foreach($questions as $q){
            if($q["type"] == "control_dropdown"){
                array_push($ddQuestions,array($q["qid"],$q["text"]));
            }
            if($q["type"] != "control_button" && $q["type"] != "control_head"){
                array_push($allQuestions,array($q["qid"],$q["text"]));
            }
        }

        $submissionArr = $this->getAuxSubmisionArrays($qid,$otherQid);
        $question = array($questionJSON["qid"],str_ireplace("'","",$questionJSON["text"]),$this->giveOptionsArray($questionJSON["options"]));
        $otherQuestion = array($otherQuestionJSON["qid"],str_ireplace("'","",$otherQuestionJSON["text"]),$otherQuestionJSON["type"]);

        return $this->c->view->render($response, "designed/dropdown/dropdown_related.twig", compact("ddQuestions","allQuestions","submissionArr","question","otherQuestion","formID"));
    }

    /*
    * Simplifies the submission data.
    */
    public function getAuxSubmisionArrays($mcQid,$otherQid){
        $compactArr = array();
        /*
            It is convenient for 
            all basic form elements.
            ***Problem with apostrophe in JSON parsing!
        */
        foreach($this->submissions as $s){
            if(array_key_exists("answer",$s["answers"][$otherQid])){
                
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
