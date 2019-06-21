<?php

    namespace App\Models;

    use App\Models\JotForm;
    use App\Models\IPInfoDB;
    use App\Models\Variables;

    use Interop\Container\ContainerInterface;
    
    class MultipleChoices{
        
        protected $c;
        protected $locationAPI;

        public function __construct(ContainerInterface $c){
            $this->c = $c;
            $this->locationAPI = new IPInfoDB("23cab5e8de616ed75dd2226da0ffa76aa9b1fcf8a7100d6c777ac0d6a875da01");
        }

        public function radarCompare($request,$response,$args){
            $this->displayErrors();
            
            $jotformAPI = new JotForm("286dec88b006d9221daf40d94278c162");
            
            $forms = $jotformAPI->getForms();
            $form = $forms[1];
            $formName = $form['title'];

            $qid = (int)$args["qid"];

            $fromDate = $request->getParam("fromDate");
            $toDate = $request->getParam("toDate");
            $country = "";
            
            $allData = $this->applyFilters($jotformAPI,$form,$qid,$fromDate,$toDate,$country);

            $firstPeriodFromDate = $request->getParam("firstPeriodFromDate");
            $firstPeriodToDate = $request->getParam("firstPeriodToDate");

            $firstPeriodData = $this->applyFilters($jotformAPI,$form,$qid,$firstPeriodFromDate,$firstPeriodToDate,$country);

            $secondPeriodFromDate = $request->getParam("secondPeriodFromDate");
            $secondPeriodToDate = $request->getParam("secondPeriodToDate");

            $secondPeriodData = $this->applyFilters($jotformAPI,$form,$qid,$secondPeriodFromDate,$secondPeriodToDate,$country);

            $compareData = array($firstPeriodData,$secondPeriodData);
            
            $radar = true;

            return $this->c->view->render($response,"attribute_page.twig",compact("allData","compareData","radar"));
        }

        public function seeAllAttributes($request,$response,$args){
            
            $this->displayErrors();

            $jotformAPI = new JotForm("286dec88b006d9221daf40d94278c162");
            
            $forms = $jotformAPI->getForms();
            $form = $forms[1];
            $formName = $form['title'];

            $qid = (int)$args["qid"];

            $fromDate = $request->getParam("fromDate");
            $toDate = $request->getParam("toDate");
            $country = $request->getParam("country");
            
            $allData = $this->applyFilters($jotformAPI,$form,$qid,$fromDate,$toDate,$country);

            $radar = false;

            return $this->c->view->render($response,"attribute_page.twig",compact("allData","radar"));
        }

        public function applyFilters($jotformAPI,$form,$qid,$fromDate,$toDate,$country){
            
            $question = $jotformAPI->getFormQuestion($form["id"],$qid);

            $submissions = $jotformAPI->getFormSubmissions($form["id"]);
           
            $validSubmissions = array();

            $filters = array();

            $options = $this->giveOptionsArray($question["options"]);

            $dateFilter = false;
            $optionFilter = false;
            $countryFilter = false;

            //date filter control
            if($fromDate != NULL && $toDate != NULL){
                $dateFilter = true;
                array_push($filters,"dateFilter");
            }

            
            //option filter control
            foreach($_POST as $k=>$p){
                if(substr($k,0,5) == "check"){
                    $optionFilter = true;
                    break;
                }
            }
            if($optionFilter){
                array_push($filters,"optionFilter");
                $optionFilterArr = array();
                foreach($_POST as $k=>$p){
                    if(substr($k,0,5) == "check"){
                        array_push($optionFilterArr,substr($k,5));
                    }
                }      
            }

            //country filter control
            if($country != "All"){
                $countryFilter = true;
                array_push($filters,"countryFilter");
            }

            
            
            $ipArr = array();
            
            foreach($submissions as $s){
                $push1 = false;
                $push2 = false;
                $push3 = false;

                //get all ip addresses
                array_push($ipArr,$s["ip"]);

                /*
                if($countryFilter){
                    if($country == $this->locationAPI->getCountry($s["ip"])["countryName"]){
                        $push3 = true;
                    }
                }
                else{
                    $push3 = true;
                }
                */


                if($dateFilter){
                    
                    $dateFilterArr = array(date('d M, Y',strtotime($fromDate)),date('d M, Y',strtotime($toDate)));
                    
                    
                    if(strtotime($fromDate)<strtotime($s["created_at"]) && strtotime($s["created_at"])<strtotime($toDate)){
                        $push1 = true;
                    }
                }
                else{
                    $push1 = true;
                }

                
                if($optionFilter){

                    $valid=true;
                    foreach($optionFilterArr as $o){
                        if(!array_key_exists("answer",$s["answers"][$qid])){
                            $valid = false;
                        }                  
                        else{
                            $choosedOptions = $s["answers"][$qid]["answer"];
                            if(!in_array($o,$choosedOptions)){
                                $valid = false;
                            }
                        }      
                    }
                    if($valid){
                        $push2 = true;
                    }
                }
                else{
                    $push2 = true;
                }

                if($push1 && $push2){
                    array_push($validSubmissions,$s);
                }
            }

            
            $ipArr = array_unique($ipArr);
            $countryArr = array();
            
            foreach($ipArr as $ip){
                array_push($countryArr,$this->locationAPI->getCountry($ip)["countryName"]);
            }

            
            $data = array();

            if(sizeof($filters) == 0){
                $validSubmissions = $submissions;
                foreach($options as $o){
                    $data[$o]=0;
                }
            }
            else{
                foreach($options as $o){
                    if($optionFilter){
                        if(!in_array($o,$optionFilterArr))
                            $data[$o]=0;
                    }
                    else{
                        $data[$o]=0;
                    }
                    
                }
            }
                        
            
            $oldIP = "0.0.0.0";

            foreach($validSubmissions as $s){
                if(array_key_exists("answer",$s["answers"][$qid])){
                    $submittedChoices = $s["answers"][$qid]["answer"];
                    
                    /*
                    $ip = $s["ip"];
                    if($oldIP != $ip)
                        $country = $locationAPI->getCountry($ip)["countryName"];
                    $oldIP = $ip;
                    */

                    /*
                    if(array_key_exists($country,$countryArr)){
                        $countryArr[$country]++;
                    }
                    else{
                        $countryArr[$country] = 1;
                    }
                    */
        
                    foreach($submittedChoices as $sub){
                        if($optionFilter){
                            if(!in_array($sub,$optionFilterArr))
                                $data[$sub]++;
                        }
                        else{
                            $data[$sub]++;
                        }
                        
                    }
                }
                else{
                    continue;
                }
            }
            
            if(empty($optionFilterArr)){
                $optionFilterArr = $options;
            }

            if(empty($dateFilterArr)){
                $dateFilterArr = array();
            }
            
            /*
            echo "<pre>";
            var_dump($countryArr);
            die();
            */

            return array(
                array($qid,$question["name"]),
                $filters,
                $options,
                $data,
                $optionFilterArr,
                $dateFilterArr,
                $countryArr
            );
            

        }


        public function index($request,$response,$args){
            $this->displayErrors();
            
            $jotformAPI = new JotForm("286dec88b006d9221daf40d94278c162");
            $forms = $jotformAPI->getForms();
            $form = $forms[1];
            $formName = $form['title'];

            $res = $this->showAll($jotformAPI,$form,$request);
            
            return $this->c->view->render($response,'display.twig',compact('res','formName'));
        }

        public function detailedIndex($request,$response,$args){
            $this->displayErrors();
            
            $jotformAPI = new JotForm("286dec88b006d9221daf40d94278c162");
            $forms = $jotformAPI->getForms();
            $form = $forms[1];
            $formName = $form['title'];

            $res = $this->showAll($jotformAPI,$form,$request);
            $month = date('m');
            $year = date('y');
            
            $resArr = $this->getMonthStats($jotformAPI,$form,$month,$year);

            return $this->c->view->render($response,'detailed_view.twig',compact('res','formName','month','resArr'));
        }

        public function getMonthStats($jotformAPI,$form,$month,$year){
            $resArr = array();
            
            $questionIDs = $this->detectMultipleChoices($jotformAPI,$form);

            $monthArr = array();
            for($i=0;$i<12;$i++){
                $monthArr[$i] = ($month+$i)%12+1;
            }
            
            $submissions = $jotformAPI->getFormSubmissions($form["id"]);

            foreach($questionIDs as $qid){
                $question = $jotformAPI->getFormQuestion($form["id"],$qid);
                
                $optionsStr = $question["options"];
                $options = $this->giveOptionsArray($optionsStr);
                
                foreach($monthArr as $k=>$m){
                    
                    foreach($options as $o){
                        $resArr[$question["name"]][$m][$o] = 0;
                        
                        foreach($submissions as $s){
                            $month = (int)date("m",strtotime($s["created_at"]));
                            $y = (int)date("y",strtotime($s["created_at"]));
                            
                            if($month == $m && $year == $y){
                                
                                if(array_key_exists("answer",$s["answers"][$qid])){
                                    
                                    if(in_array($o,$s["answers"][$qid]["answer"]))
                                        $resArr[$question["name"]][$m][$o]++;
                                
                                }
                            
                            }
                        
                        }
                   
                    }
                
                }
            
            }

        return $resArr;            

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
    
    
        public function multipleOptionsStatistic($jotformAPI,$form,$questionNum,$request){
            
            $specialize = $request->getParam('specialize');
            if($specialize == NULL){
                $specialize = "notassigned";
            }

            $submissions = $jotformAPI->getFormSubmissions($form["id"]);
            $submissionCount = sizeof($submissions);
            
            $questions = $jotformAPI->getFormQuestions($form["id"]);
    
            $question = $questions[$questionNum];
            $options = $question["options"];
    
            $optionsArr = $this->giveOptionsArray($options);
    
            foreach($optionsArr as $op){
                $assOptionsArr[$op]=0;
            }
            
            echo "<pre>";
            for($i=0;$i<$submissionCount;$i++){
    
                if(!array_key_exists('answer', $submissions[$i]["answers"][$questionNum])){
                    continue;
                }
                if($specialize == "notassigned"){
                    $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                    
                }
                else{
                    //Seperates into timestamps
                    $subDate = $submissions[$i]['created_at'];
                    $currentDate = strtotime('+0 days');
                    $subDateStr = strtotime($subDate);
                    

                    if($specialize == "last24hours"){
                        if($subDateStr>strtotime("-24 hours",$currentDate)){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    else if($specialize == "before24hours"){
                        if($subDateStr<strtotime("-24 hours",$currentDate)){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    else if($specialize == "last7days"){
                        if($subDateStr>strtotime("-7 days",$currentDate)){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    else if($specialize == "before7days"){
                        if($subDateStr<strtotime("-7 days",$currentDate)){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    else if($specialize == "last30days"){
                        if($subDateStr>strtotime("-30 days",$currentDate)){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    else if($specialize == "before30days"){
                        if($subDateStr<strtotime("-30 days",$currentDate)){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    else if($specialize == "lastoneyear"){
                        if($subDateStr>strtotime("-365 days",$currentDate)){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    else if($specialize == "beforeoneyear"){
                        if($subDateStr<strtotime("-365 days",$currentDate)){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    //control null dates
                    else if($specialize == "betweenDates"){
                        $fromDate = $request->getParam('fromDate');
                        $toDate = $request->getParam('toDate');

                        $fromDateStr = strtotime($fromDate);
                        $toDateStr = strtotime($toDate);

                        if($subDateStr>$fromDateStr && $subDateStr<$toDateStr){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    //control null dates
                    else if($specialize == "chooseAfterDate"){
                        $afterDate = $request->getParam('afterDate');

                        $afterDateStr = strtotime($afterDate);

                        if($subDateStr>$afterDateStr){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    //controll null dates
                    else if($specialize == "chooseBeforeDate"){
                        $beforeDate = $request->getParam('beforeDate');

                        $beforeDateStr = strtotime($beforeDate);

                        if($subDateStr<$beforeDateStr){
                            $currentAnswer = $submissions[$i]["answers"][$questionNum]["answer"];
                        }
                        else{
                            continue;
                        }
                    }
                    
            
                }

                foreach($assOptionsArr as $op=>$num){
                    foreach($currentAnswer as $one){
                        if($one == $op){
                            $assOptionsArr[$op]++;
                        }
                    }
                }
            }
    
            //$questionName = $question["name"];
            $str = $question["qid"].",".$question["name"];
            $finalData[$str]=$assOptionsArr;
    
            return $finalData;
              
        }
    
        public function detectMultipleChoices($jotformAPI,$form){
            
            $questions = $jotformAPI->getFormQuestions($form["id"]);
            
            $qidArray = array();
            
            foreach($questions as $q){    
                if($q["type"]=="control_checkbox"){
                    array_push($qidArray,$q["qid"]);
                }
            }
            return $qidArray;
        }
    
        public function showAll($jotformAPI,$form,$request){
            $mcQuestions = $this->detectMultipleChoices($jotformAPI,$form);
            $allResults = array();
            foreach($mcQuestions as $m){
                array_push($allResults,$this->multipleOptionsStatistic($jotformAPI,$form,$m,$request));
            }
            return $allResults;
        }

        public function displayErrors(){
            ini_set('display_errors', 1);
            ini_set('display_startup_errors', 1);
            error_reporting(E_ALL);
        }
        

    }
    
?>
