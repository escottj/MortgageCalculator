$("#home-cost, #extra-payment, #hoa, #hmi, #down-payment-dollars").focusout(function(){
    var a = $(this);
    var x = a.val();
    if (x != ""){
        a.val("$"+addCommas(x));
        if (this.id == "down-payment-dollars"){
            var $homeCost = removeCommas($("#home-cost").val());
            var newdp = (x/$homeCost)*100;
            $("#down-payment").val(Number(Math.round(newdp+'e3')+'e-3').toFixed(3)+"%");
        }
        if (this.id == "home-cost"){
            var $homeCost = removeCommas($("#home-cost").val());
            var dp = $("#down-payment").val().replace("%","");
            var newdp = (dp/100)*$homeCost;
            var y = addCommas(Number(Math.round(newdp)));
            $("#down-payment-dollars").val("$"+y);
        }
    }else{
        a.val("$0");
        if (this.id == "down-payment-dollars"){
            $("#down-payment").val("0.000%");
        }
    }
});
$("#home-cost, #extra-payment, #hoa, #hmi, #down-payment-dollars").focusin(function(){
    var a = $(this);
    var x = a.val();
    a.val(removeCommas(x));
    a.select();
});
$("#down-payment, [id^=interest-rate-], #property-tax-rate, #pmi").focusout(function(){
    var a = $(this);
    var x = a.val();
    if (x != ""){
        var temp = Number(a.val()).toFixed(3);
        a.val(temp+"%");
        if (this.id == "down-payment"){
            var $homeCost = removeCommas($("#home-cost").val());
            var newDownPaymentDollars = (temp/100)*$homeCost;
            var y = addCommas(Number(Math.round(newDownPaymentDollars)));
            $("#down-payment-dollars").val("$"+y);
        }
    }else{
        a.val("0.000%");
        if (this.id == "down-payment"){
            $("#down-payment-dollars").val("$0.00");
        }
    }
});
$("#down-payment, [id^=interest-rate-], #property-tax-rate, #pmi").focusin(function(){
    var a = $(this);
    var x = a.val();
    a.val(a.val().replace("%",""));
    a.select();
});

$("#loan-term").focusout(function(){
    var a = $(this);
    var x = a.val();
    if (x != ""){
        a.val(a.val()+" years");
    }else{
        a.val("0 years");
    }
});
$("#loan-term").focusin(function(){
    var a = $(this);
    var x = a.val();
    a.val(a.val().replace(" years",""));
    a.select();
});

function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function removeCommas(x) {
    return x.toString().replace(/,/g,"").replace("$","");
}



function calculate(){
    //Erase Existing Resu$loanTerms
    $("#table1").empty();
    $("#table2").empty();
    $("#table3").empty();
    $("#table4").empty();
    $("#table5").empty();
    $("#table6").empty();

    //Compare All Table
    var $homeCost = +$('#home-cost').val().replace(/,/g,"").replace("$","");
    var $downPaymentDollars = +$('#down-payment-dollars').val().replace(/,/g,"").replace("$","");
    var $downPayment = +$('#down-payment').val().replace("%","");
    var $loanTerm = +$("input[name='loan-term']:checked").val();
    //var $interestRate = +$('#interest-rate').val().replace("%","");
    if ($loanTerm != 0){
        var $interestRate = +$('#interest-rate-'+$loanTerm).val().replace("%","");
    } else {
        var interestArray = [+$('#interest-rate-10').val().replace("%",""),
                             +$('#interest-rate-15').val().replace("%",""),
                             +$('#interest-rate-20').val().replace("%",""),
                             +$('#interest-rate-30').val().replace("%","")];
    }
    var $hoa = +$('#hoa').val().replace(/,/g,"").replace("$","");
    var $propertyTaxRate = +$('#property-tax-rate').val().replace("%","");
    var $pmi = +$('#pmi').val().replace("%","");
    var $hmi = +$('#hmi').val().replace(/,/g,"").replace("$","");
    var $extraPayment = +$('#extra-payment').val().replace(/,/g,"").replace("$","");
    
    var rowArray = [];
    var $table6 = $("#table6");
    var textArray = ["Loan Term", "Interest Rate", "Down Payment", "Loan Amount", "Monthly Mortgage Payment",
                        "Monthly Property Tax", "Monthly PMI", "Monthly Home Owner's Insurance",
                        "Total Monthly Payment", "Total PMI Paid", "Months Until 20% Equity", "Total Interest Paid",
                        "If Paid Off in 10 years", "If Paid Off in 15 years", "If Paid Off in 20 years",
                        "If Paid Off in 30 years"];
    for (var x = 0; x < textArray.length; x++){
        var row = document.createElement("div");
        row.className = "divTableRow divTableHeader";
        var column = document.createElement("div");
        column.className = "divTableCell divTableHeaderR";
        var text = document.createTextNode(textArray[x]);
        column.appendChild(text);
        row.appendChild(column);
        rowArray.push(row);
    }

    var termArray = [10, 15, 20, 30];
    if ($loanTerm == 0){
        for (var t = 0; t < termArray.length; t++){
            var monthlyPropertyTax = (($propertyTaxRate/100)*$homeCost)/12;
            var downPaymentAmount = ($downPayment/100)*$homeCost;
            var P = $homeCost - downPaymentAmount;
            var i = interestArray[t]/100/12;
            var n = termArray[t]*12;
            var M = $extraPayment + P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
            var monthlyPMI = 0;
            if ($downPayment < 20){
                monthlyPMI = (($pmi/100)*P)/12;
            }
            var totalMonthlyPayment = M + $hoa + monthlyPropertyTax + monthlyPMI + $hmi;
            var newP = P;
            var interestPayment = 0;
            var totalInterest = 0;
            var newPMI = 0;
            var principalPayment = 0;
            var totalPMI = 0;
            var equity = 0;

            for (var j = 0; j < n; j++){
                if (newP >= M){
                    interestPayment = newP*i;
                    totalInterest = totalInterest + interestPayment;
                    principalPayment = M - interestPayment;
                    newP = newP - principalPayment;
                    if (newP/$homeCost > .8){
                        totalPMI = totalPMI + monthlyPMI;
                        equity = equity + 1;
                    }
                }else{
                    interestPayment = newP*i;
                    totalInterest = totalInterest + interestPayment;
                    principalPayment = M - interestPayment;
                    newP = newP - principalPayment;
                    break;
                }
            }
            var lt = termArray[t];
            //alert(lt);
            var tempArray = [];
            var temploop = [10, 15, 20, 30];
            for (var w = 0; w < temploop.length; w++){
                //alert(termArray[t] +" , "+ temploop[w]);
                if (lt != temploop[w] && lt > temploop[w]){
                    var tentemp = earlymploop2(temploop[w], lt, i);
                    //alert(tentemp[0]);
                    tempArray.push(tentemp[2]);
                } else {
                    tempArray.push(0);
                }
            }

            var istring =  Number(Math.round(interestArray[t]+'e3')+'e-3').toFixed(3)+"%";
            var dataArray = [termArray[t], istring, downPaymentAmount, P, M, monthlyPropertyTax, monthlyPMI,
                            $hmi, totalMonthlyPayment, totalPMI, equity, totalInterest, tempArray[0],
                            tempArray[1], tempArray[2], tempArray[3]];
            /*var istring =  Number(Math.round(interestArray[t]+'e3')+'e-3').toFixed(3)+"%";
            var dataArray = [termArray[t], istring, downPaymentAmount, P, M, monthlyPropertyTax, monthlyPMI,
                            $hmi, totalMonthlyPayment, totalPMI, equity, totalInterest];*/

            for (var y = 0; y < dataArray.length; y++){
                var column = document.createElement("div");
                if (y == 0){
                    column.className = "divTableCell  divTableHeader";
                } else {
                    column.className = "divTableCell  divTableInnerL";
                }
                if (y == 0){
                    var text = document.createTextNode(dataArray[y]+" years");
                } else if (y == 1){
                    var text = document.createTextNode(dataArray[y]);
                } else if (y == 10){
                    var text = document.createTextNode(dataArray[y]);
                } else {
                    var text = document.createTextNode("$"+addCommas(dataArray[y].toFixed(2)));
                }
                column.appendChild(text);
                rowArray[y].appendChild(column);
            }
            for (var z = 0; z < rowArray.length; z++){
                $table6.append(rowArray[z]);
            }
        }
    } else {
        var monthlyPropertyTax = (($propertyTaxRate/100)*$homeCost)/12;
        var downPaymentAmount = ($downPayment/100)*$homeCost;
        var P = $homeCost - downPaymentAmount;
        var i = $interestRate/100/12;
        var n = $loanTerm*12;
        var M = $extraPayment + P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
        var monthlyPMI = 0;
        if ($downPayment < 20){
            monthlyPMI = (($pmi/100)*P)/12;
        }
        var totalMonthlyPayment = M + $hoa + monthlyPropertyTax + monthlyPMI + $hmi;
        var newP = P;
        var interestPayment = 0;
        var totalInterest = 0;
        var newPMI = 0;
        var principalPayment = 0;
        var totalPMI = 0;
        var equity = 0;

        for (var j = 0; j < n; j++){
            if (newP >= M){
                interestPayment = newP*i;
                totalInterest = totalInterest + interestPayment;
                principalPayment = M - interestPayment;
                newP = newP - principalPayment;
                if (newP/$homeCost > .8){
                    totalPMI = totalPMI + monthlyPMI;
                    equity = equity + 1;
                }
            }else{
                interestPayment = newP*i;
                totalInterest = totalInterest + interestPayment;
                principalPayment = M - interestPayment;
                newP = newP - principalPayment;
                break;
            }
        }

        var tempArray = [];
        var temploop = [10, 15, 20, 30];
        for (var w = 0; w < temploop.length; w++){
            if ($loanTerm != temploop[w] && $loanTerm > temploop[w]){
                var tentemp = earlymploop2(temploop[w], $loanTerm, i);
                tempArray.push(tentemp[2]);
            } else {
                tempArray.push(0);
            }
        }


        var istring =  Number(Math.round($interestRate+'e3')+'e-3').toFixed(3)+"%";
        var dataArray = [$loanTerm, istring, downPaymentAmount, P, M, monthlyPropertyTax, monthlyPMI,
                         $hmi, totalMonthlyPayment, totalPMI, equity, totalInterest, tempArray[0],
                         tempArray[1], tempArray[2], tempArray[3]];
        for (var y = 0; y < dataArray.length; y++){
            var column = document.createElement("div");
            if (y == 0){
                column.className = "divTableCell  divTableHeader";
            } else {
                column.className = "divTableCell  divTableInnerL";
            }
            if (y == 0){
                var text = document.createTextNode(dataArray[y]+" years");
            } else if (y == 1){
                var text = document.createTextNode(dataArray[y]);
            } else if (y == 10){
                var text = document.createTextNode(dataArray[y]);
            } else if (y == 12) {
                var text = document.createTextNode("Total Interest Paid: " + "$"+addCommas(dataArray[y].toFixed(2)));
                var text2 = document.createTextNode("Extra Monthly Payment: " + "$"+addCommas(tentemp[1].toFixed(2)));
                var text3 = document.createTextNode("Total Savings: " +"$"+addCommas(tentemp[3].toFixed(2)));
                var html = document.createElement('p');
                var listItem = document.createElement('div');
                listItem.appendChild(text);
                html.appendChild(listItem);
                var listItem = document.createElement('div');
                listItem.appendChild(text2);
                html.appendChild(listItem);
                var listItem = document.createElement('div');
                listItem.appendChild(text3);
                html.appendChild(listItem);
            } else {
                var text = document.createTextNode("$"+addCommas(dataArray[y].toFixed(2)));
            }
            
            if (y == 12){
                column.appendChild(html);
            } else {
                column.appendChild(text);
            }
            rowArray[y].appendChild(column);
        }

        for (var z = 0; z < rowArray.length; z++){
            $table6.append(rowArray[z]);
        }
    }
    //var helptest = earlymploop2(10);
    //Early Mortgage Payoff Loop (Extra Monthly Payment)
    function earlymploop2(d, lt, i){
        //var array1 = [21000, 1100, 110, 11, 1.1, .11, .011, .0011];
        //var array2 = [1000, 100, 10, 1, .1, .01, .001, .0001];
        var array1 = [10000, 1];
        var array2 = [1, .001];
        var maxti = 0;
        //maxti Calculation
        var P2 = $homeCost - $downPaymentDollars;
        //i = ($interestRate/100)/12;
        var n2 = lt*12;
        var M2 = P2*i*Math.pow(1+i,n2)/(Math.pow(1+i,n2)-1);
        newP = P2;
        interestPayment = 0;
        var totalInterest2 = 0;
        principalPayment = 0;
        for (var j = 0; j < n; j++){
            mdcount = mdcount + 1;
            interestPayment = newP*i;
            totalInterest2 = totalInterest2 + interestPayment;
            principalPayment = M2 - interestPayment;
            newP = newP - principalPayment;
        }
        maxti = totalInterest2;
        //alert(totalInterest2);
        var low = 0;
        var maxSwitch = 0;
        var savings = 0;
        var md = d*12;
        var mdcount = 0;
        var xm = 0;
        
        for (var q = 0; q < array1.length; q++){
            for (var m = 0; m < array1[q]; m+=array2[q]){
                var mdcount = 0;
                P2 = $homeCost - $downPaymentDollars;
                //i = ($interestRate/100)/12;
                n2 = lt*12;
                xm = low + m;
                M2 = xm + P2*i*Math.pow(1+i,n2)/(Math.pow(1+i,n2)-1);
                var minM = M2 - xm;
                newP = P2;
                interestPayment = 0;
                totalInterest2 = 0;
                principalPayment = 0;
                for (var j = 0; j < n; j++){
                    mdcount = mdcount + 1;
                    interestPayment = newP*i;
                    totalInterest2 = totalInterest2 + interestPayment;
                    principalPayment = M2 - interestPayment;
                    newP = newP - principalPayment;
                    if (newP < 1){
                        break;
                    }
                    if (mdcount > md){
                        break;
                    }
                }
                var addM = M2 - minM;
                if (mdcount > md){
                    low = low + m;
                }else if (mdcount < md){
                    //low = low;
                }else{
                    break;
                }
            }
        }
        savings = maxti - totalInterest2;
        return [mdcount, addM, totalInterest2, savings];
    }
}