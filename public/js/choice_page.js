
        //Functions to tide up...
        
        
    
        function chooseQuestionType(){
            currentType = document.getElementById("getQuestionType").value;
            if(currentType == "mc"){
                document.getElementById("singleChoiceButtons").style.display = "none";
                document.getElementById("dropdownButtons").style.display = "none";
                document.getElementById("multipleChoiceButtons").style.display = "inline-block";
                changeTab();
            }
            else if(currentType == "sc"){
                document.getElementById("dropdownButtons").style.display = "none";
                document.getElementById("multipleChoiceButtons").style.display = "none";
                document.getElementById("singleChoiceButtons").style.display = "inline-block";
                changeTab();
            }
            else if(currentType == "dd"){
                document.getElementById("multipleChoiceButtons").style.display = "none";
                document.getElementById("singleChoiceButtons").style.display = "none";
                document.getElementById("dropdownButtons").style.display = "inline-block";
                changeTab();
            }
        }
        
        function changeTab(){
            document.getElementById("indexForm").style.display = "none";
            document.getElementById("indexFormSC").style.display = "none";
            document.getElementById("indexFormDD").style.display = "none";
            document.getElementById("timeForm").style.display = "none";
            document.getElementById("timeFormSC").style.display = "none";
            document.getElementById("timeFormDD").style.display = "none";
            document.getElementById("relatedForm").style.display = "none";
            document.getElementById("relatedFormSC").style.display = "none";
            document.getElementById("relatedFormDD").style.display = "none";
            
            defaultChartArea();
            makeButtonTextDefault("mc");
            makeButtonTextDefault("sc");
            makeButtonTextDefault("dd");
        }
        
        function drawExampleChart(type){
            if(type == "bar-radar"){
                drawBarRadar();
            }
            else if(type == "timely-basis"){
                drawLineChart();
            }
            else if(type == "related-stats"){
                drawRelatedChart();
            }
        }
        
        function drawRelatedChart(){
            document.getElementById("right1").innerHTML = "<br><canvas style=\"display:block;margin:0 auto;\" id=\"exampleDoughnutChart\" width=\"200\" height=\"200\"></canvas>";
            document.getElementById("right2").innerHTML = "<br><br><p style=\"font-size:18px;margin:0 auto;\" class=\"questionHeader\"><font color=\"#dc3545\"> List emails of people who has a platypus! </font><br> Put no limits to your specifications! Reach other form questions' statistics scoped by one answer. </p>";
            document.getElementById("right3").innerHTML = "<br><br><p style=\"font-size:18px;margin:0 auto;\" class=\"questionHeader\"><font color=\"#dc3545\">I want that submission on my desk!</font><br> Go inbox and see the submission you want. JotCharts will help you to find the right submission. </p>";                            
            document.getElementById("right4").innerHTML = "<br><table style=\"margin:0 auto;font-size:14px;width:200px;\" class=\"dataTable\"><tr> <th>Emails</th> </tr> <tr> <td> flymetothemoon@xmail.com </td> </tr>  <tr> <td> andletmeplay@xahoo.com </td> </tr>  <tr> <td> amongthestars@xmail.com </td> </tr></table>";
            
            var ctxDoughnut = document.getElementById("exampleDoughnutChart");
            var myDoughnutChart = new Chart(ctxDoughnut,{
                type: 'doughnut',
                data: {
                    labels: ["A","B","C"],
                    datasets: [
                    {
                        label: "Value",
                        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                        data: [2478,5267,734]
                    }
                ]
                },
                options: {
                    responsive: false
                }
            });
        }


    
        function drawLineChart(){
            document.getElementById("right2").innerHTML = "<br><canvas style=\"display:block;margin:0 auto;\" id=\"exampleLineChart\" width=\"200\" height=\"200\"></canvas>";
            document.getElementById("right1").innerHTML = "<br><p style=\"font-size:18px;margin:0 auto;\" class=\"questionHeader\"><font color=\"#dc3545\">See the effects of planetary movements of Venus on your submitters.</font><br> You can investigate certain time statistics of your form using JotCharts. </p>";
            document.getElementById("right4").innerHTML = "<br><br><p style=\"font-size:18px;margin:0 auto;\" class=\"questionHeader\"><font color=\"#dc3545\">Queue up!</font><br> Classify your submissions based on time. </p>";                            
            document.getElementById("right3").innerHTML = "<canvas style=\"margin:0 auto;\" id=\"examplePolarChart\" width=\"200\" height=\"200\"></canvas>";
            
            var ctxLine = document.getElementById("exampleLineChart");
            var myLineChart = new Chart(ctxLine,{
                type: 'line',
                data: {
                    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
                    datasets: [{ 
                        data: [86,114,106,106,107,111,133,221,783,2478],
                        label: "A",
                        borderColor: "#3e95cd",
                        fill: false
                    }, 
                    { 
                            data: [282,350,411,502,635,809,947,1402,3700,5267],
                            label: "B",
                            borderColor: "#8e5ea2",
                            fill: false
                    }
                    ]
                },
                options: {
                    responsive:false
                }
            });

            var ctxPolar = document.getElementById("examplePolarChart");
            var myPolarChart = new Chart(ctxPolar, {
                type: 'polarArea',
                data: {
                    labels: ["A","B","C"],
                    datasets: [
                    {
                        label: "Population (millions)",
                        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
                        data: [2478,5267,734]
                    }
                    ]
                },
                options: {
                    responsive:false,
                }
            });
        }

        function drawBarRadar(){
            document.getElementById("right1").innerHTML = "<br><canvas style=\"display:block;margin:0 auto;\" id=\"examplePieChart\" width=\"200\" height=\"200\"></canvas>";
            document.getElementById("right2").innerHTML = "<br><p style=\"font-size:18px;margin:0 auto;\" class=\"questionHeader\"><font color=\"#dc3545\">Do people who like jazz music also like hiking?</font><br> You can specify your results and analyse using JotCharts filters. Use option and date filter to reach detailed statistics of your submissions.</p>";
            document.getElementById("right3").innerHTML = "<br><br><p style=\"font-size:18px;margin:0 auto;\" class=\"questionHeader\"><font color=\"#dc3545\">Is \"March Madness\" real?</font><br> Radar chart is to help you compare data from different time periods. </p>";                            
            document.getElementById("right4").innerHTML = "<canvas style=\"margin:0 auto;\" id=\"exampleRadarChart\" width=\"200\" height=\"200\"></canvas>";
        
            var ctxPie = document.getElementById("examplePieChart").getContext('2d');
            var myPieChart = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: ["Awesome", "Astonishing", "Perfect", "Genius"],
                    datasets: [
                    {
                        backgroundColor: [
                        "rgb(255, 99, 132)",
                        "rgb(75, 192, 192)",
                        "rgb(54, 162, 235)",
                        "rgb(153, 102, 255)",
                        "rgb(255, 205, 86)",
                        "rgb(231,233,237)",
                        "rgb(255, 159, 64)"
                        ],
                        data: [3,4,5,7]
                    }
                    ]
                },
                options: {
                    title: {
                        text: "Define JotForm.",
                        display: true
                    },
                responsive: false,
                legend: {
                    labels: {
                        fontColor: 'black'
                    }
                }
                }
            });
    
            var ctxRadar = document.getElementById("exampleRadarChart");
            var myRadarChart = new Chart(ctxRadar, {
                                type: 'radar',
                                data: {
                                labels: ["Awesome", "Astonishing", "Perfect", "Genius"],
                                datasets: [
                                    {
                                    label: "Guests",
                                    fill: true,
                                    backgroundColor: "rgba(179,25,198,0.2)",
                                    borderColor: "rgba(179,181,198,1)",
                                    pointBorderColor: "black",
                                    pointBackgroundColor: "rgba(179,181,198,1)",
                                    data: [12,4,6,7,2]
                                    }, {
                                    label: "Users",
                                    fill: true,
                                    backgroundColor: "rgba(100,192,132,0.2)",
                                    borderColor: "rgba(255,99,132,1)",
                                    pointBorderColor: "black",
                                    pointBackgroundColor: "rgba(255,99,132,1)",
                                    pointBorderColor: "#fff",
                                    data: [4,8,4,7,9]
                                    }
                                ]
                                },
                                options: {
                                    responsive: false,
                                    scale: {
                                        angleLines: {
                                            display: true,
                                            color: "black"
                                        },
                                        ticks: {
                                        min: 0,
                                        max: 12
                                        }
                                    }
                                }

            });
        }

        function defaultChartArea(){
            document.getElementById("right1").innerHTML = "";
            document.getElementById("right2").innerHTML = "";
            document.getElementById("right3").innerHTML = "";
            document.getElementById("right4").innerHTML = "";
            document.getElementById("infoArea").style.display = "none";
            document.getElementById("defaultArea").style.display = "block";
        }
        
        function removeDefault(){
            document.getElementById("infoArea").style.display = "block";
            document.getElementById("defaultArea").style.display = "none";
        }

        function showIndexForm(qtype){
            var indexForm, timeForm, relatedForm;
            if(qtype == "mc"){
                indexForm = "indexForm";
                timeForm = "timeForm";
                relatedForm = "relatedForm";
            }
            else if(qtype == "sc"){
                indexForm = "indexFormSC";
                timeForm = "timeFormSC";
                relatedForm = "relatedFormSC";
            }
            else if(qtype == "dd"){
                indexForm = "indexFormDD";
                timeForm = "timeFormDD";
                relatedForm = "relatedFormDD";
            }
            
            var element = document.getElementById(indexForm);
            if(element.style.display != "none"){
                element.style.display = "none";
                makeButtonTextDefault(qtype);
                defaultChartArea();
            } 
            else{
                removeDefault();
                element.style.display = "block";
                makeButtonTextColored("index",qtype);
                updateAllLinks("index",qtype);
                
                drawExampleChart("bar-radar");

                document.getElementById(timeForm).style.display = "none";
                document.getElementById(relatedForm).style.display = "none";
            }
        }
        
        function showTimeForm(qtype){
            var indexForm, timeForm, relatedForm;
            if(qtype == "mc"){
                indexForm = "indexForm";
                timeForm = "timeForm";
                relatedForm = "relatedForm";
            }
            else if(qtype == "sc"){
                indexForm = "indexFormSC";
                timeForm = "timeFormSC";
                relatedForm = "relatedFormSC";
            }
            else if(qtype == "dd"){
                indexForm = "indexFormDD";
                timeForm = "timeFormDD";
                relatedForm = "relatedFormDD";
            }
            
            var element = document.getElementById(timeForm);
            if(element.style.display != "none"){
                element.style.display = "none";
                makeButtonTextDefault(qtype);
                defaultChartArea();
            } 
            else{
                removeDefault();
                element.style.display = "block";
                makeButtonTextColored("time",qtype);
                updateAllLinks("time",qtype);
                
                drawExampleChart("timely-basis");
                
                document.getElementById(indexForm).style.display = "none";
                document.getElementById(relatedForm).style.display = "none";
            }
        }

        function showRelatedForm(qtype){
            var indexForm, timeForm, relatedForm;
            if(qtype == "mc"){
                indexForm = "indexForm";
                timeForm = "timeForm";
                relatedForm = "relatedForm";
            }
            else if(qtype == "sc"){
                indexForm = "indexFormSC";
                timeForm = "timeFormSC";
                relatedForm = "relatedFormSC";
            }
            else if(qtype == "dd"){
                indexForm = "indexFormDD";
                timeForm = "timeFormDD";
                relatedForm = "relatedFormDD";
            }

            var element = document.getElementById(relatedForm);
            if(element.style.display != "none"){
                element.style.display = "none";
                makeButtonTextDefault(qtype);
                defaultChartArea();
            } 
            else{
                removeDefault();
                element.style.display = "block";
                makeButtonTextColored("related",qtype);
                updateAllLinks("related",qtype);
                
                drawExampleChart("related-stats");
                
                document.getElementById(timeForm).style.display = "none";
                document.getElementById(indexForm).style.display = "none";
            }
        }

        function makeButtonTextColored(type, qtype){
            if(type == "index"){
                if(qtype == "mc"){
                    document.getElementById("btn1").style.backgroundColor="#ffc107";
                    document.getElementById("btn2").style.backgroundColor="#f8f9fa";
                    document.getElementById("btn3").style.backgroundColor="#f8f9fa";
                }
                else if(qtype == "sc"){
                    document.getElementById("btn1SC").style.backgroundColor="#ffc107";
                    document.getElementById("btn2SC").style.backgroundColor="#f8f9fa";
                    document.getElementById("btn3SC").style.backgroundColor="#f8f9fa";
                }
                else if(qtype == "dd"){
                    document.getElementById("btn1DD").style.backgroundColor="#ffc107";
                    document.getElementById("btn2DD").style.backgroundColor="#f8f9fa";
                    document.getElementById("btn3DD").style.backgroundColor="#f8f9fa";
                }
            }
            else if(type == "time"){
                if(qtype == "mc"){
                    document.getElementById("btn2").style.backgroundColor="#ffc107";
                    document.getElementById("btn1").style.backgroundColor="#f8f9fa";
                    document.getElementById("btn3").style.backgroundColor="#f8f9fa";
                }
                else if(qtype == "sc"){
                    document.getElementById("btn2SC").style.backgroundColor="#ffc107";
                    document.getElementById("btn1SC").style.backgroundColor="#f8f9fa";
                    document.getElementById("btn3SC").style.backgroundColor="#f8f9fa";
                }
                else if(qtype == "dd"){
                    document.getElementById("btn2DD").style.backgroundColor="#ffc107";
                    document.getElementById("btn1DD").style.backgroundColor="#f8f9fa";
                    document.getElementById("btn3DD").style.backgroundColor="#f8f9fa";
                
                }
            }
            else if(type == "related"){
                if(qtype == "mc"){
                    document.getElementById("btn3").style.backgroundColor="#ffc107";
                    document.getElementById("btn2").style.backgroundColor="#f8f9fa";
                    document.getElementById("btn1").style.backgroundColor="#f8f9fa";
                }
                else if(qtype == "sc"){
                    document.getElementById("btn3SC").style.backgroundColor="#ffc107";
                    document.getElementById("btn2SC").style.backgroundColor="#f8f9fa";
                    document.getElementById("btn1SC").style.backgroundColor="#f8f9fa";
                }
                else if(qtype == "dd"){
                    document.getElementById("btn3DD").style.backgroundColor="#ffc107";
                    document.getElementById("btn2DD").style.backgroundColor="#f8f9fa";
                    document.getElementById("btn1DD").style.backgroundColor="#f8f9fa";
                }
            }
        }

        function makeButtonTextDefault(qtype){
            if(qtype == "mc"){
                document.getElementById("btn3").style.backgroundColor="#f8f9fa";
                document.getElementById("btn2").style.backgroundColor="#f8f9fa";
                document.getElementById("btn1").style.backgroundColor="#f8f9fa";
            }

            else if(qtype == "sc"){
                document.getElementById("btn3SC").style.backgroundColor="#f8f9fa";
                document.getElementById("btn2SC").style.backgroundColor="#f8f9fa";
                document.getElementById("btn1SC").style.backgroundColor="#f8f9fa";
            }
            else if(qtype == "dd"){
                document.getElementById("btn3DD").style.backgroundColor="#f8f9fa";
                document.getElementById("btn2DD").style.backgroundColor="#f8f9fa";
                document.getElementById("btn1DD").style.backgroundColor="#f8f9fa";
            }
        }

        function updateAllLinks(formStyle, qtype){
            if(formStyle == "index"){
                if(qtype == "mc"){
                    var mcq = document.getElementById("indexID").value;
                    document.getElementById("indexSubmit").innerHTML = "<a style=\"border:1px solid black;display:inline-block;width:100px;\" class=\"button\" href=\"/public/jotcharts/"+formID+"/checkbox/bar-radar/"+mcq+"\">Select</a>"
                }
                else if(qtype == "sc"){
                    var scq = document.getElementById("indexIDSC").value;
                    document.getElementById("indexSubmitSC").innerHTML = "<a style=\"border:1px solid black;display:inline-block;width:100px;\" class=\"button\" href=\"/public/jotcharts/"+formID+"/radio/bar-radar/"+scq+"\">Select</a>"
                }
                else if(qtype == "dd"){
                    var ddq = document.getElementById("indexIDDD").value;
                    document.getElementById("indexSubmitDD").innerHTML = "<a style=\"border:1px solid black;display:inline-block;width:100px;\" class=\"button\" href=\"/public/jotcharts/"+formID+"/dropdown/bar-radar/"+ddq+"\">Select</a>"
                }
            }
            else if(formStyle == "time"){
                if(qtype == "mc"){
                    var mcq = document.getElementById("timeID").value;
                    document.getElementById("timeSubmit").innerHTML = "<a style=\"border:1px solid black;display:inline-block;width:100px;\" class=\"button\" href=\"/public/jotcharts/"+formID+"/checkbox/time-basis/"+mcq+"\">Select</a>"
                }
                else if(qtype == "sc"){
                    var scq = document.getElementById("timeIDSC").value;
                    document.getElementById("timeSubmitSC").innerHTML = "<a style=\"border:1px solid black;display:inline-block;width:100px;\" class=\"button\" href=\"/public/jotcharts/"+formID+"/radio/time-basis/"+scq+"\">Select</a>"
                }
                else if(qtype == "dd"){
                    var ddq = document.getElementById("timeIDDD").value;
                    document.getElementById("timeSubmitDD").innerHTML = "<a style=\"border:1px solid black;display:inline-block;width:100px;\" class=\"button\" href=\"/public/jotcharts/"+formID+"/dropdown/time-basis/"+ddq+"\">Select</a>"
                }
            }
            else if(formStyle == "related"){
                if(qtype == "mc"){
                    var mcq = document.getElementById("mcq").value;
                    var otherq = document.getElementById("otherq").value;
                    document.getElementById("relatedSubmit").innerHTML = "<a style=\"border:1px solid black;display:inline-block;width:100px;\" class=\"button\" href=\"/public/jotcharts/"+formID+"/checkbox/related-stats/"+mcq+"/"+otherq+"\">Select</a>"
                }
                else if(qtype == "sc"){
                    var scq = document.getElementById("scq").value;
                    var otherqSC = document.getElementById("otherqSC").value;
                    document.getElementById("relatedSubmitSC").innerHTML = "<a style=\"border:1px solid black;display:inline-block;width:100px;\" class=\"button\" href=\"/public/jotcharts/"+formID+"/radio/related-stats/"+scq+"/"+otherqSC+"\">Select</a>"
                }
                else if(qtype == "dd"){
                    var ddq = document.getElementById("ddq").value;
                    var otherqDD = document.getElementById("otherqDD").value;
                    document.getElementById("relatedSubmitDD").innerHTML = "<a style=\"border:1px solid black;display:inline-block;width:100px;\" class=\"button\" href=\"/public/jotcharts/"+formID+"/dropdown/related-stats/"+ddq+"/"+otherqDD+"\">Select</a>"
                }
            }
        }