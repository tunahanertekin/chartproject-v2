        
        
                var qid = question[0];
                var questionName = question[1];
                var options = question[2];

                var optionFilterArr = [];
                var filteredOptionsArr = [];

                var dateValidSubmissions = [];
                var optionValidSubmissions = [];
                var givenSubmissions = [];

                var myPieChart;
                var myOtherChart;
                var myOtherChartMC;

                var fromDate;
                var toDate;

                assignAndDraw();

                function getRandomColor(){
                    
                    var letters = '0123456789ABCDEF';
                    var color = '#';
                    for (var i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                }
        
                function getRandomColorArr(n){
                    var arr = [];
                    for(var i = 0; i<n ; i++){
                        arr.push(getRandomColor());
                    }
                    return arr;
                }

                function updateOtherQuestion(){
                    var newID = document.getElementById("otherQuestionValue").value;
                    location.href = "/public/jotcharts/"+formID+"/checkbox/related-stats/"+question[0]+"/"+newID;
                }

                function decideName(){
                    if(document.getElementById("chartOrTableName").value == "chart"){
                        document.getElementById("firstOrLast").style.display = "inline-block";
                        otherStat();
                    }
                    else{
                        document.getElementById("firstOrLast").style.display = "none";
                        otherStat();
                    }
                }
                
                function decideAddress(){
                    if(document.getElementById("chartOrTableAddress").value == "chart"){
                        document.getElementById("addressType").style.display = "inline-block";
                        otherStat();
                    }
                    else{
                        document.getElementById("addressType").style.display = "none";
                        otherStat();
                    }
                }

                function updateMCQuestion(){
                    var newID = document.getElementById("mcQuestionValue").value;
                    location.href = "/public/jotcharts/"+formID+"/checkbox/related-stats/"+newID+"/"+otherQuestion[0];
                }

                function updateDates(){
                    var dates = document.getElementsByName("betweenDates");
                    fromDate = dates[0].value;
                    toDate = dates[1].value;

                    dateValidSubmissions = [];

                    if(fromDate.length != 0 && toDate.length == 0){
                        var fromDateFormat = new Date(fromDate);
                        for(var key in submissionArr){
                            var subDate = new Date(submissionArr[key][0]);
                            if(fromDateFormat<subDate){
                                dateValidSubmissions.push(submissionArr[key]);
                            }
                            else{
                                continue;
                            }
                        }
                    }
                    else if(fromDate.length == 0 && toDate.length != 0){
                        var toDateFormat = new Date(toDate);
                        for(var key in submissionArr){
                            var subDate = new Date(submissionArr[key][0]);
                            if(subDate<toDateFormat){
                                dateValidSubmissions.push(submissionArr[key]);
                            }
                            else{
                                continue;
                            }
                        }
                    }
                    else if(fromDate.length != 0 && toDate.length != 0){
                        var fromDateFormat = new Date(fromDate);
                        var toDateFormat = new Date(toDate);
                        for(var key in submissionArr){
                            var subDate = new Date(submissionArr[key][0]);
                            if(fromDateFormat<subDate && subDate<toDateFormat){
                                dateValidSubmissions.push(submissionArr[key]);
                            }
                            else{
                                continue;
                            }
                        }
                    }
                    else{
                        dateValidSubmissions = submissionArr;
                    }

                }

                function updateOptions(){
                    var x = document.getElementsByName("check");
                    
                    optionFilterArr = [];
                    filteredOptionsArr = [];
                    for (var i = 0; i < x.length; i++) {
                        if (x[i].type == "checkbox") {
                            if(x[i].checked == true){
                                optionFilterArr.push(x[i].value);
                            }
                            else{
                                filteredOptionsArr.push(x[i].value);
                            }
                        }
                    }

                    updateOptionsSubmissions();
                }

                function updateOptionsSubmissions(){
                    var valid = true;
                    optionValidSubmissions = [];
                    for(var key in submissionArr){
                        valid = true;
                        for(var key2 in optionFilterArr){
                            if(!submissionArr[key][1].includes(optionFilterArr[key2])){
                                valid = false;
                            }
                        }
                        if(valid){
                            optionValidSubmissions.push(submissionArr[key]);
                        }
                    }
                }

                function mergeSubmissions(){
                    updateOptions();
                    updateDates();

                    givenSubmissions = [];
                    for(var key1 in dateValidSubmissions){
                        for(var key2 in optionValidSubmissions){
                            if(dateValidSubmissions[key1][3] == optionValidSubmissions[key2][3]){
                                givenSubmissions.push(dateValidSubmissions[key1]);
                            }
                        }
                    }
                    
                    //console.log(submissionArr);
                    //console.log(optionValidSubmissions);
                    otherStat();
                }

                function assignAndDraw(){
                    mergeSubmissions();

                    var assocArr = [];
                    for(var key in filteredOptionsArr){
                        assocArr[filteredOptionsArr[key]] = 0;
                    }
                    for(var key in givenSubmissions){
                        for(var key2 in givenSubmissions[key][1]){
                            assocArr[givenSubmissions[key][1][key2]]++;
                        }
                    }

                    var keyarr = [];
                    var valarr = [];
                    for(var key in assocArr){
                        keyarr.push(key);
                        valarr.push(assocArr[key]);
                    }

                    document.getElementById("chartArea").innerHTML = "<canvas id=\"myPieChart\" width=\"400\" height=\"400\" style=\"margin:0 auto;\"></canvas>";
                    drawPieChart(keyarr,valarr);
                }

                function drawPieChart(keyarr,valarr){
                    if(myPieChart != null){
                        myPieChart.destroy();
                    }
                    var ctxPie = document.getElementById("myPieChart").getContext('2d');
                                    myPieChart = new Chart(ctxPie, {
                                        type: 'doughnut',
                                        data: {
                                            labels: keyarr,
                                            datasets: [{
                                            backgroundColor: getRandomColorArr(keyarr.length),
                                            data: valarr
                                            }]
                                        },
                                        options: {
                                            responsive: false,
                                                    legend: {
                                                        labels: {
                                                            fontColor: '#343a40'
                                                        }
                                                    }
                                                }
                                    });
                }

        
                function otherStat(){
                    //detect the question type
                    //console.log(otherQuestion)
                    otherQuestionType = otherQuestion[2];

                    var ordinaryTableTypes = [
                        "control_textbox",
                        "control_textarea",
                        "control_number",
                        "control_email"
                    ];
                    
                
                    var statHtml = document.getElementById("otherStatArea");
                    statHtml.innerHTML = "";
                    var explanation = "";

                        if(optionFilterArr.length == 0){
                            if(fromDate.length != 0 && toDate.length == 0){
                                explanation = "There are the submission statistics after <font color=\"#28a745\">"+fromDate+"</font>.";
                            }
                            else if(fromDate.length == 0 && toDate.length != 0){
                                explanation = "There are the submission statistics before <font color=\"#28a745\">"+toDate+"</font>.";
                            }
                            else if(fromDate.length != 0 && toDate.length != 0){
                                explanation = "There are the submission statistics between <font color=\"#28a745\">"+fromDate+"</font> and <font color=\"#28a745\">"+toDate+"</font>.";
                            }
                            else{
                                explanation = "All results.<br><br>You can use filters on the section right.";
                            }
                        }
                        else{
                            if(fromDate.length != 0 && toDate.length == 0){
                                explanation += "There are the submission statistics of people who selected";
                                for(var key in optionFilterArr){
                                    explanation += " '<font color=\"#dc3545\">" +optionFilterArr[key]+"</font>'<br> ";
                                }
                                explanation += " in question <font color=\"#6f42c1\">"+ questionName +"</font> after <font color=\"#28a745\">"+fromDate+"</font>.";
                            }
                            else if(fromDate.length == 0 && toDate.length != 0){
                                explanation += "There are the submission statistics of people who selected";
                                for(var key in optionFilterArr){
                                    explanation += " '<font color=\"#dc3545\">" +optionFilterArr[key]+"</font>'<br> ";
                                }
                                explanation += " in question <font color=\"#6f42c1\">"+ questionName +"</font> before <font color=\"#28a745\">"+toDate+"</font>.";
                            }
                            else if(fromDate.length != 0 && toDate.length != 0){
                                explanation += "There are the submission statistics of people who selected";
                                for(var key in optionFilterArr){
                                    explanation += " '<font color=\"#dc3545\">" +optionFilterArr[key]+"</font>'<br> ";
                                }
                                explanation += " in question <font color=\"#6f42c1\">"+ questionName +"</font> between <font color=\"#28a745\">"+fromDate+"</font> and <font color=\"#28a745\">"+toDate+"</font>.";
                            }
                            else{
                                explanation += "There are the submission statistics of people who selected";
                                for(var key in optionFilterArr){
                                    explanation += " <br> '<font color=\"#dc3545\">" +optionFilterArr[key]+"</font>'";
                                }
                                explanation += "<br> in question <font color=\"#6f42c1\">"+ questionName + "</font> for all times.";
                                
                            }
                        }

                    
                    if(ordinaryTableTypes.includes(otherQuestionType)){
                        if(document.getElementById("chartOrTable").value == "chart"){
                            var tempArr = [];
                            for(var key in givenSubmissions){
                                if(givenSubmissions[key][2] in tempArr){
                                    tempArr[givenSubmissions[key][2]]++;
                                }
                                else{
                                    tempArr[givenSubmissions[key][2]] = 1;
                                }
                            }
                            var str = "<canvas id=\"myOtherChart\" width=\"400\" height=\"400\" style=\"margin:0 auto;\"></canvas>";
                        
                            var otherKeyArr = [];
                            var otherValArr = [];

                            for(var key in tempArr){
                                otherKeyArr.push(key);
                                otherValArr.push(tempArr[key]);
                            }

                            if(myOtherChart != null){
                                myOtherChart.destroy();
                            }


                            statHtml.innerHTML = str+"<br><br>"+explanation;

                            
                            var ctxPieOther = document.getElementById("myOtherChart").getContext('2d');
                                            myOtherChart = new Chart(ctxPieOther, {
                                                type: 'doughnut',
                                                data: {
                                                    labels: otherKeyArr,
                                                    datasets: [{
                                                    backgroundColor: getRandomColorArr(otherKeyArr.length),
                                                    data: otherValArr
                                                    }]
                                                },
                                                options: {
                                                    responsive: false,
                                                            legend: {
                                                                labels: {
                                                                    fontColor: '#343a40'
                                                                }
                                                            }
                                                        }
                                            });

                        }
                        else{
                            var str = "";
                            str += "<input style=\"margin:0 auto;width:400px;\" class=\"w3-input\" type=\"text\" id=\"searchBar\" onkeyup=\"searchInTable()\" placeholder=\"Search...\"><br>";
                            str += "<table id=\"table\" class=\"dataTable\" style=\"text-align:center;margin:0 auto;\">";
                            str += "<tr><th>"+ otherQuestion[1] +"</th></tr>";
                            for(var key in givenSubmissions){
                                //console.log();
                                str += "<tr> <td>"+ "<a href=\"https://www.jotform.com/inbox/"+givenSubmissions[key][3]+"\">"+givenSubmissions[key][2]+"</a>"+"</td> </tr>";
                            }
                            str += "</table>";

                            statHtml.innerHTML = str+"<br><br>"+explanation;
                        }
                        
                    }
                    else if(otherQuestionType == "control_dropdown"){
                        var tempArr = [];
                        for(var key in givenSubmissions){
                            if(givenSubmissions[key][2] in tempArr){
                                tempArr[givenSubmissions[key][2]]++;
                            }
                            else{
                                tempArr[givenSubmissions[key][2]] = 1;
                            }
                        }
                        
                        var str = "";
                        str += "<input style=\"margin:0 auto;width:400px;\" class=\"w3-input\" type=\"text\" id=\"searchBar\" onkeyup=\"searchInTable()\" placeholder=\"Search for input...\"><br>";
                        str += "<table id=\"table\" class=\"dataTable\" style=\"text-align:center;margin:0 auto;\">";
                        str += "<tr><th> Choice </th> <th> Times </th> </tr>";

                        for(var key in tempArr){
                            //add filter to inbox
                            str += "<tr> <td><a href=\"https://www.jotform.com/inbox/"+formID+"\">"+ key +"</a></td> <td> "+ tempArr[key] +" </td> </tr>";
                        }
                        str += "</table>";

                        statHtml.innerHTML = str+"<br><br>"+explanation;
                    }
                    else if(otherQuestionType == "control_radio"){
                        var tempArr = [];
                        for(var key in givenSubmissions){
                            if(givenSubmissions[key][2] in tempArr){
                                tempArr[givenSubmissions[key][2]]++;
                            }
                            else{
                                tempArr[givenSubmissions[key][2]] = 1;
                            }
                        }
                        
                        var str = "<canvas id=\"myOtherChart\" width=\"400\" height=\"400\" style=\"margin:0 auto;\"></canvas>";
                        
                        var otherKeyArr = [];
                        var otherValArr = [];

                        for(var key in tempArr){
                            otherKeyArr.push(key);
                            otherValArr.push(tempArr[key]);
                        }

                        if(myOtherChart != null){
                            myOtherChart.destroy();
                        }


                        statHtml.innerHTML = str+"<br><br>"+explanation;

                        
                        var ctxPieOther = document.getElementById("myOtherChart").getContext('2d');
                                        myOtherChart = new Chart(ctxPieOther, {
                                            type: 'doughnut',
                                            data: {
                                                labels: otherKeyArr,
                                                datasets: [{
                                                backgroundColor: getRandomColorArr(otherKeyArr.length),
                                                data: otherValArr
                                                }]
                                            },
                                            options: {
                                                responsive: false,
                                                        legend: {
                                                            labels: {
                                                                fontColor: '#343a40'
                                                            }
                                                        }
                                                    }
                                        });

                        
                    }
                    else if(otherQuestionType == "control_checkbox"){
                        var tempArr = [];

                        for(var key in givenSubmissions){
                            for(var key2 in givenSubmissions[key][2]){
                                if(givenSubmissions[key][2][key2] in tempArr){
                                    tempArr[givenSubmissions[key][2][key2]]++;
                                }
                                else{
                                    tempArr[givenSubmissions[key][2][key2]] = 1;
                                }

                            }
                            
                        }
                        
                        var str = "<canvas id=\"myOtherChartMC\" width=\"400\" height=\"400\" style=\"margin:0 auto;\"></canvas>";
                        
                        var otherKeyArr = [];
                        var otherValArr = [];

                        for(var key in tempArr){
                            otherKeyArr.push(key);
                            otherValArr.push(tempArr[key]);
                        }

                        if(myOtherChartMC != null){
                            myOtherChartMC.destroy();
                        }


                        statHtml.innerHTML = str+"<br><br>"+explanation;

                        //console.log(otherKeyArr);
                        //console.log(otherValArr);
                        //console.log(givenSubmissions);
                        var ctxPieOtherMC = document.getElementById("myOtherChartMC").getContext('2d');
                                        myOtherChartMC = new Chart(ctxPieOtherMC, {
                                            type: 'doughnut',
                                            data: {
                                                labels: otherKeyArr,
                                                datasets: [{
                                                backgroundColor:    getRandomColorArr(otherKeyArr.length),
                                                data: otherValArr
                                                }]
                                            },
                                            options: {
                                                responsive: false,
                                                        legend: {
                                                            labels: {
                                                                fontColor: '#343a40'
                                                            }
                                                        }
                                                    }
                                        });

                    }
                    else if(otherQuestionType == "control_fullname"){
                        
                        if(document.getElementById("chartOrTableName").value == "chart"){
                            var nameType = document.getElementById("firstOrLast").value;
                            
                            var tempArr = [];
                            for(var key in givenSubmissions){
                                if(givenSubmissions[key][2][nameType] in tempArr){
                                    tempArr[givenSubmissions[key][2][nameType]]++;
                                }
                                else{
                                    tempArr[givenSubmissions[key][2][nameType]] = 1;
                                }
                            }
                            var str = "<canvas id=\"myOtherChart\" width=\"400\" height=\"400\" style=\"margin:0 auto;\"></canvas>";
                        
                            var otherKeyArr = [];
                            var otherValArr = [];

                            for(var key in tempArr){
                        
                                otherKeyArr.push(key);
                                otherValArr.push(tempArr[key]);
                            }

                            if(myOtherChart != null){
                                myOtherChart.destroy();
                            }
                            statHtml.innerHTML = str+"<br><br>"+explanation;

                            var ctxPieOther = document.getElementById("myOtherChart").getContext('2d');
                            myOtherChart = new Chart(ctxPieOther, {
                                                type: 'doughnut',
                                                data: {
                                                    labels: otherKeyArr,
                                                    datasets: [{
                                                    backgroundColor: getRandomColorArr(otherKeyArr.length),
                                                    data: otherValArr
                                                    }]
                                                },
                                                options: {
                                                    responsive: false,
                                                            legend: {
                                                                labels: {
                                                                    fontColor: '#343a40'
                                                                }
                                                            }
                                                        }
                                            });
                        }
                        else{
                            var str = "";
                            str += "<input style=\"margin:0 auto;width:400px;\" class=\"w3-input\" type=\"text\" id=\"searchBar\" onkeyup=\"searchInTable()\" placeholder=\"Search for last names...\"><br>";
                            str += "<table id=\"table\" class=\"dataTable\" style=\"text-align:center;margin:0 auto;\">";
                            str += "<tr><th>"+ "Last" +"</th> <th>"+ "First" +"</th> </tr>";
                            for(var key in givenSubmissions){
                                //add filter to inbox link
                                str += "<tr> <td><a href=\"https://www.jotform.com/inbox/"+givenSubmissions[key][3]+"\">"+
                                givenSubmissions[key][2]["last"]
                                +"</a></td> <td><a href=\"https://www.jotform.com/inbox/"+formID+"/"+givenSubmissions[key][3]+"\">" +
                                givenSubmissions[key][2]["first"]
                                +"</a></td> </tr>";
                            }
                            str += "</table>";

                            statHtml.innerHTML = str+"<br><br>"+explanation;
                        }
                        
                    }
                    else if(otherQuestionType == "control_address"){
                        if(document.getElementById("chartOrTableAddress").value == "chart"){
                            var addressType = document.getElementById("addressType").value;
                            
                            var tempArr = [];
                            for(var key in givenSubmissions){
                                if(givenSubmissions[key][2][addressType] in tempArr){
                                    tempArr[givenSubmissions[key][2][addressType]]++;
                                }
                                else{
                                    tempArr[givenSubmissions[key][2][addressType]] = 1;
                                }
                            }
                            var str = "<canvas id=\"myOtherChart\" width=\"400\" height=\"400\" style=\"margin:0 auto;\"></canvas>";
                        
                            var otherKeyArr = [];
                            var otherValArr = [];

                            for(var key in tempArr){
                        
                                otherKeyArr.push(key);
                                otherValArr.push(tempArr[key]);
                            }

                            if(myOtherChart != null){
                                myOtherChart.destroy();
                            }
                            statHtml.innerHTML = str+"<br><br>"+explanation;

                            var ctxPieOther = document.getElementById("myOtherChart").getContext('2d');
                            myOtherChart = new Chart(ctxPieOther, {
                                                type: 'doughnut',
                                                data: {
                                                    labels: otherKeyArr,
                                                    datasets: [{
                                                    backgroundColor: getRandomColorArr(otherKeyArr.length),
                                                    data: otherValArr
                                                    }]
                                                },
                                                options: {
                                                    responsive: false,
                                                            legend: {
                                                                labels: {
                                                                    fontColor: '#343a40'
                                                                }
                                                            }
                                                        }
                                            });
                        }
                        else{
                            var str = "";
                            str += "<input style=\"margin:0 auto;width:400px;\" class=\"w3-input\" type=\"text\" id=\"searchBar\" onkeyup=\"searchInTable()\" placeholder=\"Search for address detail...\"><br>";
                            str += "<table id=\"table\" class=\"dataTable\" style=\"text-align:center;margin:0 auto;\">";
                            str += "<tr><th>"+ "Address" +"</th> </tr>";
                            for(var key in givenSubmissions){
                                str += "<tr> <td>"+ "<a href=\"https://www.jotform.com/inbox/"+givenSubmissions[key][3]+"\">"+
                                givenSubmissions[key][2]["addr_line1"] + "<br>" +givenSubmissions[key][2]["addr_line2"]+"<br>"+givenSubmissions[key][2]["city"]+" "+givenSubmissions[key][2]["country"]+"<br>"+givenSubmissions[key][2]["postal"]+" "+givenSubmissions[key][2]["state"]
                                +"</a></td> </tr>";
                            }
                            str += "</table>";

                            statHtml.innerHTML = str+"<br><br>"+explanation;
                        }
                    }
                    else if(otherQuestionType == "control_phone"){
                        var str = "";
                        str += "<input style=\"margin:0 auto;width:400px;\" class=\"w3-input\" type=\"text\" id=\"searchBar\" onkeyup=\"searchInTable()\" placeholder=\"Search for phone...\"><br>";
                        str += "<table id=\"table\" class=\"dataTable\" style=\"text-align:center;margin:0 auto;\">";
                        str += "<tr><th>"+ "Phone Number" +"</th> </tr>";
                        for(var key in givenSubmissions){
                            str += "<tr> <td>"+ "<a href=\"https://www.jotform.com/inbox/"+givenSubmissions[key][3]+"\">"+
                            givenSubmissions[key][2]["area"]+" "+givenSubmissions[key][2]["phone"]
                            +"</a></td>"+"</tr>";
                        }
                        str += "</table>";

                        statHtml.innerHTML = str+"<br><br>"+explanation;
                    }
                }
                function searchInTable() {
                    //W3 method
                    var input, filter, table, tr, td, i, txtValue;
                    input = document.getElementById("searchBar");
                    filter = input.value.toUpperCase();
                    table = document.getElementById("table");
                    tr = table.getElementsByTagName("tr");
                    for (i = 0; i < tr.length; i++) {
                        td = tr[i].getElementsByTagName("td")[0];
                        if (td) {
                            txtValue = td.textContent || td.innerText;
                            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                tr[i].style.display = "";
                            } else {
                                tr[i].style.display = "none";
                            }
                        }       
                    }
                }
            
    
    
    