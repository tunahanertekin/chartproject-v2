
        var optionFilteredSubmissionArr = [];
        var dateFilteredSubmissionArr = [];
        var givenArr = [];

        var qid = question[0];
        var questionName = [1];
        var options = question[2];

        var optionFilterArr = [];
        var filteredOptionsArr = [];
                
        var myPieChart;

        

        function applyOptionFilter() {
        
          var x = document.getElementsByName("check");
          var i;
          optionFilterArr = [];
          filteredOptionsArr = [];
          for (i = 0; i < x.length; i++) {
            if (x[i].type == "checkbox") {
              if(x[i].checked == true){
                optionFilterArr.push(x[i].id);
              }
              else{
                filteredOptionsArr.push(x[i].id);
              }
            }
          }
          options = filteredOptionsArr;

          applyOptionFilterSub();
        }

        function applyOptionFilterSub(){

          var push = true;
          for(var key in submissionArr){
            push = true;
            for(var key2 in optionFilterArr){
              if(submissionArr[key][1] != null){
                if(!submissionArr[key][1].includes(optionFilterArr[key2])){
                  push = false;
                }
              }
              else{
                push = false;
              }
              
            }
            if(push)
              optionFilteredSubmissionArr.push(submissionArr[key]);
          }
        }

        function assignAndDraw(){
          
          mergeFilters();

          var associativeStat = [];
          for(var key in options){
            associativeStat[options[key]]=0;
          }
          
          for(var key in givenArr){
            var currentAnswer = givenArr[key][1];

            for(var key2 in currentAnswer){
              associativeStat[currentAnswer[key2]]++;
            }
          }

          var keyarr = [];
          var valarr = [];

          for(var key in associativeStat){
            keyarr.push(key);
            valarr.push(associativeStat[key]);
          }

          //console.log(options);

          document.getElementById("chartPlace").innerHTML="<canvas id=\"myPieChart\" width=\"400\" height=\"400\"></canvas>";
          drawChart(keyarr,valarr);
        }
        

        function drawChart(keyarr,valarr){
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
                                                fontColor: 'white'
                                            }
                                        }
                                    }
                        });
        }

        function applyDateFilter(){

          var dates = document.getElementsByName("betweendates");
          var fromDate = dates[0];
          var toDate = dates[1];


          if(fromDate.value.length != 0 && toDate.value.length == 0){
            var fromDateFormat = new Date(fromDate.value);
            for(var key in submissionArr){
              var subDate = new Date(submissionArr[key][0]);
              if(fromDateFormat<subDate){
                dateFilteredSubmissionArr.push(submissionArr[key]);
              }
              else{
                continue;
              }
            }
          }
          else if(fromDate.value.length == 0 && toDate.value.length != 0){
            var toDateFormat = new Date(toDate.value);
            for(var key in submissionArr){
              var subDate = new Date(submissionArr[key][0]);
              if(subDate<toDateFormat){
                dateFilteredSubmissionArr.push(submissionArr[key]);
              }
              else{
                continue;
              }
            }
          }
          else if(fromDate.value.length != 0 && toDate.value.length != 0){
            var fromDateFormat = new Date(fromDate.value);
            var toDateFormat = new Date(toDate.value);
            for(var key in submissionArr){
              var subDate = new Date(submissionArr[key][0]);
              if(fromDateFormat<subDate && subDate<toDateFormat){
                dateFilteredSubmissionArr.push(submissionArr[key]);
              }
              else{
                continue;
              }
            }
          }
          else{
            dateFilteredSubmissionArr = submissionArr;
          }
        }


        function mergeFilters(){
          givenArr = [];
          optionFilteredSubmissionArr = [];
          dateFilteredSubmissionArr = [];
          applyDateFilter();
          applyOptionFilter();

         
          for(var key1 in optionFilteredSubmissionArr){
            for(var key2 in dateFilteredSubmissionArr){
              if(optionFilteredSubmissionArr[key1][2] == dateFilteredSubmissionArr[key2][2])
                givenArr.push(optionFilteredSubmissionArr[key1]);
            }
          }
        }        
  





        var firstSubmissionDataset = [];
        var secondSubmissionDataset = [];

        var commonSubmissions = [];

        var firstValSet = [];
        var secondValSet = [];

        var originalOptions = question[2];

        var firstPeriodStr = "";
        var secondPeriodStr = "";

        var radarChart;


        function setValues(){

          setFirstDataset();
          setSecondDataset();
          
          var assocArr1 = [];
          var assocArr2 = [];
          for(var key in originalOptions){
            assocArr1[originalOptions[key]]=0;
            assocArr2[originalOptions[key]]=0;
          }

          for(var key in firstSubmissionDataset){
            var currentAnswer = firstSubmissionDataset[key][1];

            for(var key2 in currentAnswer){
              assocArr1[currentAnswer[key2]]++;
            }
          }

          for(var key in secondSubmissionDataset){
            var currentAnswer = secondSubmissionDataset[key][1];

            for(var key2 in currentAnswer){
              assocArr2[currentAnswer[key2]]++;
            }
          }

          firstValSet = [];
          secondValSet = [];

          for(var key in assocArr1){
            firstValSet.push(assocArr1[key]);
          }

          for(var key in assocArr2){
            secondValSet.push(assocArr2[key]);
          }
          document.getElementById("radarChartPlace").innerHTML="<canvas id=\"myChartRadar\" width=\"400\" height=\"400\"></canvas>";
          drawRadar();
        }

        function dateFormatter(date){
          dateStr = date.toString();
          var elements = dateStr.split(" ");
          return elements[1] + " " + elements[2] + ", " + elements[3] + " " + elements[0];
        }
        

        function setFirstDataset(){
          var dates = document.getElementsByName("datePeriod1");
          var fromDate = dates[0];
          var toDate = dates[1];

          firstSubmissionDataset = [];

          if(fromDate.value.length != 0 && toDate.value.length == 0){
            var fromDateFormat = new Date(fromDate.value);
            firstPeriodStr = "after "+dateFormatter(fromDateFormat);
            for(var key in submissionArr){
              var subDate = new Date(submissionArr[key][0]);
              if(fromDateFormat<subDate){
                firstSubmissionDataset.push(submissionArr[key]);
              }
              else{
                continue;
              }
            }
          }
          else if(fromDate.value.length == 0 && toDate.value.length != 0){
            var toDateFormat = new Date(toDate.value);
            firstPeriodStr = "before "+dateFormatter(toDateFormat);
            for(var key in submissionArr){
              var subDate = new Date(submissionArr[key][0]);
              if(subDate<toDateFormat){
                firstSubmissionDataset.push(submissionArr[key]);
              }
              else{
                continue;
              }
            }
          }
          else if(fromDate.value.length != 0 && toDate.value.length != 0){
            var fromDateFormat = new Date(fromDate.value);
            var toDateFormat = new Date(toDate.value);
            firstPeriodStr = "between "+dateFormatter(fromDateFormat)+" and "+dateFormatter(toDateFormat);
            for(var key in submissionArr){
              var subDate = new Date(submissionArr[key][0]);
              if(fromDateFormat<subDate && subDate<toDateFormat){
                firstSubmissionDataset.push(submissionArr[key]);
              }
              else{
                continue;
              }
            }
          }
          else{
              firstPeriodStr = "All times"
              firstSubmissionDataset = submissionArr;
          }
        }

        function setSecondDataset(){
          var dates = document.getElementsByName("datePeriod2");
          var fromDate = dates[0];
          var toDate = dates[1];

          secondSubmissionDataset = [];

          if(fromDate.value.length != 0 && toDate.value.length == 0){
            var fromDateFormat = new Date(fromDate.value);
            secondPeriodStr = "after "+dateFormatter(fromDateFormat);
            for(var key in submissionArr){
              var subDate = new Date(submissionArr[key][0]);
              if(fromDateFormat<subDate){
                secondSubmissionDataset.push(submissionArr[key]);
              }
              else{
                continue;
              }
            }
          }
          else if(fromDate.value.length == 0 && toDate.value.length != 0){
            var toDateFormat = new Date(toDate.value);
            secondPeriodStr = "before "+dateFormatter(toDateFormat);
            for(var key in submissionArr){
              var subDate = new Date(submissionArr[key][0]);
              if(subDate<toDateFormat){
                secondSubmissionDataset.push(submissionArr[key]);
              }
              else{
                continue;
              }
            }
          }
          else if(fromDate.value.length != 0 && toDate.value.length != 0){
            var fromDateFormat = new Date(fromDate.value);
            var toDateFormat = new Date(toDate.value);
            secondPeriodStr = "between "+dateFormatter(fromDateFormat)+" and "+dateFormatter(toDateFormat);
            for(var key in submissionArr){
              var subDate = new Date(submissionArr[key][0]);
              if(fromDateFormat<subDate && subDate<toDateFormat){
                secondSubmissionDataset.push(submissionArr[key]);
              }
              else{
                continue;
              }
            }
          }
          else{
              secondPeriodStr = "All times"
              secondSubmissionDataset = submissionArr;
          }
        }

        
        function drawRadar(){

          var max = 0;
          for(var key in firstValSet){
            if(firstValSet[key]>max){
              max = firstValSet[key];
            }
          }
          for(var key in secondValSet){
            if(secondValSet[key]>max){
              max = secondValSet[key];
            }
          }

          var valuesCanvas = document.getElementById("myChartRadar");



          var valuesData = {
          labels: originalOptions,
          datasets: [{
              label: firstPeriodStr,
              backgroundColor: "rgba(200,0,0,0.2)",
              borderColor: "orange",
              data: firstValSet
          },
          {
              label: secondPeriodStr,
              backgroundColor: "rgba(0,0,200,0.2)",
              borderColor: "blue",
              data: secondValSet
          }
          ]
          };

          if(radarChart != null){
            radarChart.destroy();
          }

          radarChart = new Chart(valuesCanvas, {
              type: 'radar',
              data: valuesData,
              options: {
                  responsive: false,
                  scale: {
                      angleLines: {
                        display: true,
                        color: "white"
                      },
                      ticks: {
                      min: 0,
                      max: max
                      }
                  }
            }
          });
        }
        
