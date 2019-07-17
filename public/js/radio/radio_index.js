

                var fromDate, toDate;
                var validSubmissions = [];
                var options = question[2];
                var myPieChart;
                var months = [ "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December" ];
                

                var qid = question[0];
                var questionName = question[1];

                var assocArr = [];
                var monthArr = [];
                var dayArr = [];

                aroundDate = new Date();

                getMonthlyStats();


                function eliminateSubmissions(){
                    fromDate = document.getElementById("fromDate").value;
                    toDate = document.getElementById("toDate").value;

                    validSubmissions = [];

                    var fromDateFormat = new Date(fromDate);
                    var toDateFormat = new Date(toDate);

                    if(fromDate.length !=0 && toDate.length == 0){
                        for(var key in submissionArr){
                            var subDate = new Date(submissionArr[key][0]);
                            if(fromDateFormat<subDate){
                                validSubmissions.push(submissionArr[key]);
                            }
                        }
                    }
                    else if(fromDate.length == 0 && toDate.length != 0){
                        for(var key in submissionArr){
                            var subDate = new Date(submissionArr[key][0]);
                            if(subDate<toDateFormat){
                                validSubmissions.push(submissionArr[key]);
                            }
                        }
                    }
                    else if(fromDate.length != 0 && toDate.length != 0 ){
                        for(var key in submissionArr){
                            var subDate = new Date(submissionArr[key][0]);
                            if(fromDateFormat<subDate && subDate<toDateFormat){
                                validSubmissions.push(submissionArr[key]);
                            }
                        }
                    }
                    else{
                        validSubmissions = submissionArr;
                    }

                    prepareData();
                }

                function prepareData(){
                    var assocArrPie = [];

                    var keyarr = [];
                    var valarr = [];

                    for(var key in options){
                        assocArrPie[options[key]] = 0;
                    }

                    for(key in validSubmissions){
                        assocArrPie[validSubmissions[key][1]]++;
                    }

                    for(var key in assocArr){
                        keyarr.push(key);
                        valarr.push(assocArrPie[key]);
                    }
                    
                    drawPieChart(keyarr,valarr);
                }   

                function drawPieChart(keyarr,valarr){
                    
                    if(myPieChart != null){
                        myPieChart.destroy();
                    }
                    var ctxPie = document.getElementById("myPieChart").getContext('2d');
                                    myPieChart = new Chart(ctxPie, {
                                        type: 'pie',
                                        data: {
                                            labels: keyarr,
                                            datasets: [{
                                            backgroundColor: [
                                                "rgb(255, 99, 132,.5)",
                                                "rgb(75, 192, 192,.5)",
                                                "rgb(54, 162, 235,.5)",
                                                "rgb(153, 102, 255,.5)",
                                                "rgb(255, 205, 86,.5)",
                                                "rgb(231,233,237,.5)",
                                                "rgb(255, 159, 64,.5)"
                                            ],
                                            data: valarr
                                            }]
                                        },
                                        options: {
                                            responsive: false,
                                                    legend: {
                                                        labels: {
                                                            fontColor: 'black'
                                                        }
                                                    }
                                                }
                                    });
                }
    
                
                function getRandomColor(){
                    var letters = '0123456789ABCDEF';
                    var color = '#';
                    for (var i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                }

                function setAroundDate(){
                    var aroundDateStr = document.getElementById("aroundDate");
                    
                    if(aroundDateStr.value.length != 0){
                        var tempDate = new Date(aroundDateStr.value);
                        var arMonth = tempDate.getMonth();
                        var arYear = tempDate.getFullYear();
                        if(tempDate.getDate()>15)
                            arMonth = arMonth+1;
                        
                        tempDate = tempDate.getDate()-15;
                        aroundDate.setDate(tempDate);
                        aroundDate.setMonth(arMonth);
                        aroundDate.setFullYear(arYear);
                    }
                    else
                        aroundDate = new Date();
                    getDailyStats();
                }

                function decide(){
                    var selectDecision = document.getElementById("statBasis");
                    if(selectDecision.value == "monthly"){
                        document.getElementById("aroundDateChoice").style.visibility = "hidden";
                        getMonthlyStats();
                    }
                    else if(selectDecision.value == "daily"){
                        console.log("hey");
                        document.getElementById("aroundDateChoice").style.visibility = "visible";
                        getDailyStats();
                    }
                }

                function getMonthlyStats(){
                    var curDate = new Date();
                    var pastDate = new Date();

                    monthArr = [];

                    for(var i=11;i>=0;i--){
                        var otherDate = curDate.getMonth()-i;
                        pastDate.setMonth(otherDate);
                        monthArr.push((pastDate.getFullYear())+"-"+(pastDate.getMonth()+1));
                        pastDate = new Date();
                    }

                    assocArr = [];
                    for(var key in options){
                        assocArr[options[key]]=[];
                        for(var key2 in monthArr){
                            assocArr[options[key]][monthArr[key2]]=0;
                        }
                    }

                    for(var key in submissionArr){
                        var subDate = submissionArr[key][0];
                        var subDateFormatted = new Date(subDate);
                        var choice = submissionArr[key][1];

                        assocArr[choice][subDateFormatted.getFullYear()+"-"+(subDateFormatted.getMonth()+1)]++;
                        
                    }


                    document.getElementById("chartPlace").innerHTML="<canvas id=\"line-chart\" width=\"900\" height=\"500\"></canvas>";
                    drawMonthlyLineChart();
                }

                function getDailyStats(){
                    
                    var curDate = new Date(JSON.parse(JSON.stringify(aroundDate)));
                    var pastDate = new Date(JSON.parse(JSON.stringify(aroundDate)));

                    dayArr = [];

                    for(var i=29;i>=0;i--){
                        var otherDate = curDate.getDate()-i;
                        pastDate.setDate(otherDate);
                        dayArr.push((pastDate.getFullYear())+"-"+(pastDate.getMonth()+1)+"-"+pastDate.getDate());
                        pastDate = new Date(JSON.parse(JSON.stringify(aroundDate)));
                    }


                    assocArr = [];

                    for(var key in options){
                        assocArr[options[key]]=[];
                        for(var key2 in dayArr){
                            assocArr[options[key]][dayArr[key2]]=0;
                        }
                    }

                    for(var key in submissionArr){
                        var subDate = submissionArr[key][0];
                        var subDateFormatted = new Date(subDate);
                        var choice = submissionArr[key][1];

                        
                       
                        assocArr[choice][subDateFormatted.getFullYear()+"-"+(subDateFormatted.getMonth()+1)+"-"+subDateFormatted.getDate()]++;
                        
                    }


                    document.getElementById("chartPlace").innerHTML="<canvas id=\"line-chart\" width=\"900\" height=\"500\"></canvas>";
                    drawDailyLineChart();
                }

                function drawDailyLineChart(){
                    var datasets = [];
                    var newArr = [];
                    
                    for(var key in assocArr){
                        newArr[key]=[];
                        for(var key2 in assocArr[key]){
                            newArr[key].push(assocArr[key][key2]);
                        }
                    }
                    
                    for(var key in newArr){
                        datasets.push(
                            {
                                data: newArr[key],
                                label: key,
                                borderColor: getRandomColor(),
                                fill: false
                            }
                        );
                    }

                    var labels = [];
                    for(var key in dayArr){
                        labels.push(convertDate(dayArr[key]));
                    }
                    
                    Chart.defaults.global.defaultFontColor = 'black';
                    new Chart(document.getElementById("line-chart"), {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: datasets
                        },
                        options: {
                            title: {
                            display: true,
                            text: 'Times chosen'
                            },
                            responsive: false
                        }
                    });
                }

                function drawMonthlyLineChart(){
                    var datasets = [];
                    var newArr = [];
                    
                    for(var key in assocArr){
                        newArr[key]=[];
                        for(var key2 in assocArr[key]){
                            newArr[key].push(assocArr[key][key2]);
                        }
                    }
                    
                    for(var key in newArr){
                        datasets.push(
                            {
                                data: newArr[key],
                                label: key,
                                borderColor: getRandomColor(),
                                fill: false
                            }
                        );
                    }

                    var labels = [];
                    for(var key in monthArr){
                        labels.push(convertMonthAndYear(monthArr[key]));
                    }
                    
                    Chart.defaults.global.defaultFontColor = 'black';
                    new Chart(document.getElementById("line-chart"), {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: datasets
                        },
                        options: {
                            title: {
                            display: true,
                            text: 'Times chosen'
                            },
                            responsive: false
                        }
                    });

                }

                function convertMonthAndYear(str){
                    var arr = str.split("-");
                    return months[arr[1]-1]+" "+arr[0];
                    
                }

                function convertDate(str){
                    var arr = str.split("-");
                    return months[arr[1]-1]+" "+arr[2]+", "+arr[0];
                }