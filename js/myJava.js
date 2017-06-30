var columnID = 0;
var textArray = ["Loan Term", "Interest Rate", "Down Payment", "Loan Amount", "Monthly Mortgage Payment",
                    "Monthly Property Tax", "Monthly PMI", "Monthly Home Owner's Insurance",
                    "Total Monthly Payment", "Total PMI Paid", "Months Until 20% Equity", "Total Interest Paid",
                    "If Paid Off in 10 years", "If Paid Off in 15 years", "If Paid Off in 20 years",
                    "If Paid Off in 30 years", ""];

var $table8 = $("#table8");
var rowArray = [];
for (var x = 0; x < textArray.length; x++){
    var row = document.createElement("tr");
    var column = document.createElement("th");
    //column.className = "col-sm-3";
    var text = document.createTextNode(textArray[x]);
    column.appendChild(text);
    row.appendChild(column);
    rowArray.push(row);
}

function resetAll() {
    $("#table8").empty();
    rowArray = [];
    for (var x = 0; x < textArray.length; x++){
        var row = document.createElement("tr");
        var column = document.createElement("th");
        //column.className = "col-sm-3";
        var text = document.createTextNode(textArray[x]);
        column.appendChild(text);
        row.appendChild(column);
        rowArray.push(row);
    }
};

$("#helpBlock2").toggle();

//Number Validation
$(document).ready(function() {
    $("#home-cost, #extra-payment, #hoa, #hoi, #down-payment-dollars, #down-payment, [id^=interest-rate-], #property-tax-rate, #pmi").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
});


$("#hoa2").keyup(function (e) {
    if (this.id == "hoa2"){
        if (+$(this).val() >= 100 || +$(this).val() == ""){
            $("#helpBlock2").show();
            $("#hoa-group").attr('class', 'form-group form-group-md nopadding has-error');
            $("#hoa-glyph").attr('class', 'glyphicon glyphicon-remove form-control-feedback');
        }else{
            $("#helpBlock2").hide();
            $("#hoa-group").attr('class', 'form-group form-group-md nopadding has-success');
            $("#hoa-glyph").attr('class', 'glyphicon glyphicon-ok form-control-feedback');
        }
    }
});

/*$("#hoa2").focusout(function (e) {
    if (this.id == "hoa2"){
        if (+$(this).val() >= 100){
            $("#helpBlock2").show();
            $("#hoa-group").attr('class', 'form-group form-group-md nopadding has-error');
            $("#hoa-glyph").attr('class', 'glyphicon glyphicon-remove form-control-feedback');
        }else{
            $("#helpBlock2").hide();
            $("#hoa-group").attr('class', 'form-group form-group-md nopadding has-success');
            $("#hoa-glyph").attr('class', 'glyphicon glyphicon-ok form-control-feedback');
        }
    }
});*/


$(document).ready(function() {

});

$("#home-cost, #extra-payment, #hoa, #hoi, #down-payment-dollars").focusout(function(){
    var a = $(this);
    var x = a.val();
    if (x != ""){
        a.val(addCommas(x));
        if (this.id == "down-payment-dollars"){
            var $homeCost = removeCommas($("#home-cost").val());
            var newdp = (x/$homeCost)*100;
            $("#down-payment").val(Number(Math.round(newdp+'e3')+'e-3').toFixed(3));
        }
        if (this.id == "home-cost"){
            var $homeCost = removeCommas($("#home-cost").val());
            var dp = $("#down-payment").val().replace("%","");
            var newdp = (dp/100)*$homeCost;
            var y = addCommas(Number(Math.round(newdp)));
            $("#down-payment-dollars").val(y);
        }
    }
});
$("#home-cost, #extra-payment, #hoa, #hoi, #down-payment-dollars").focusin(function(){
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
        a.val(temp);
        if (this.id == "down-payment"){
            var $homeCost = removeCommas($("#home-cost").val());
            var newDownPaymentDollars = (temp/100)*$homeCost;
            var y = addCommas(Number(Math.round(newDownPaymentDollars)));
            $("#down-payment-dollars").val(y);
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



function calculate(kl){
    //Erase Existing Results
    /*$("#table1").empty();
    $("#table2").empty();
    $("#table3").empty();
    $("#table4").empty();
    $("#table5").empty();
    $("#table6").empty();
    $("#table7").empty();
    $("#table8").empty();*/

    //Compare All Table
    var $homeCost = +$('#home-cost').val().replace(/,/g,"").replace("$","");
    var $downPaymentDollars = +$('#down-payment-dollars').val().replace(/,/g,"").replace("$","");
    var $downPayment = +$('#down-payment').val().replace("%","");
    var $loanTerm = kl;
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
    var $hoi = +$('#hoi').val().replace(/,/g,"").replace("$","");
    var $extraPayment = +$('#extra-payment').val().replace(/,/g,"").replace("$","");
    
    //var rowArray = [];
    var $table6 = $("#table6");
    var $table7 = $("#table7");
    //var $table8 = $("#table8");
    /*var textArray = ["Loan Term", "Interest Rate", "Down Payment", "Loan Amount", "Monthly Mortgage Payment",
                     "Monthly Property Tax", "Monthly PMI", "Monthly Home Owner's Insurance",
                     "Total Monthly Payment", "Total PMI Paid", "Months Until 20% Equity", "Total Interest Paid",
                     "If Paid Off in 10 years", "If Paid Off in 15 years", "If Paid Off in 20 years",
                     "If Paid Off in 30 years", ""];

    if ($table8.data('headers') == null){
        for (var x = 0; x < textArray.length; x++){
            var row = document.createElement("tr");
            var column = document.createElement("th");
            var text = document.createTextNode(textArray[x]);
            column.appendChild(text);
            row.appendChild(column);
            rowArray.push(row);
            $table8.data('headers', 'true');
        }
    }*/


    var termArray = [10, 15, 20, 30];
    if ($loanTerm == 0){
        for (var t = 0; t < termArray.length; t++){
            var help = test($homeCost, $downPayment, termArray[t], interestArray[t], $hoa, $propertyTaxRate, $pmi, $hoi, $extraPayment);
            //return [downPaymentAmount, P, M, monthlyPropertyTax, monthlyPMI, totalMonthlyPayment, totalPMI, equity, totalInterest];
            var lt = termArray[t];
            var i = interestArray[t]/100/12;
            var n = termArray[t]*12;
            var tempArray = [];
            var temploop = [10, 15, 20, 30];
            for (var w = 0; w < temploop.length; w++){
                if (lt != temploop[w] && lt > temploop[w]){
                    var tentemp = earlymploop2(temploop[w], lt, i);
                    tempArray.push(tentemp[2]);
                } else {
                    tempArray.push(0);
                }
            }

            var istring =  Number(Math.round(interestArray[t]+'e3')+'e-3').toFixed(3)+"%";
            var dataArray = [termArray[t], istring, help[0], help[1], help[2], help[3], help[4],
                            $hoi, help[5], help[6], help[7], help[8], tempArray[0],
                            tempArray[1], tempArray[2], tempArray[3]];
            for (var y = 0; y < dataArray.length; y++){

                var column = document.createElement("td");
                column.id = columnID;

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

                if (y == 15){
                    var column = document.createElement("td");
                    column.id = columnID;

                    /*var bt = document.createElement('button');
                    bt.className = "btn btn-success btn-sm";
                    bt.setAttribute("onclick","saveTest('"+columnID+"')");
                    bt.innerText = "Save";
                    column.appendChild(bt);*/

                    var bt = document.createElement('button');
                    bt.className = "btn btn-danger btn-sm";
                    bt.setAttribute("onclick","deleteTest('"+columnID+"')");
                    bt.innerText = "Delete";
                    column.appendChild(bt);

                    rowArray[16].appendChild(column);
                }
            }
            for (var z = 0; z <= rowArray.length; z++){
                $table8.append(rowArray[z]);
            }
            columnID++;

        }
    } else {
        var help = test($homeCost, $downPayment, $loanTerm, $interestRate, $hoa, $propertyTaxRate, $pmi, $hoi, $extraPayment);
        //return [downPaymentAmount, P, M, monthlyPropertyTax, monthlyPMI, totalMonthlyPayment, totalPMI, equity, totalInterest];
        var tempArray = [];
        var temploop = [10, 15, 20, 30];
        var n = $loanTerm*12;
        var i = $interestRate/100/12;
        for (var w = 0; w < temploop.length; w++){
            if ($loanTerm != temploop[w] && $loanTerm > temploop[w]){
                var tentemp = earlymploop2(temploop[w], $loanTerm, i);
                tempArray.push(tentemp[2]);
            } else {
                tempArray.push(0);
            }
        }
        var istring =  Number(Math.round($interestRate+'e3')+'e-3').toFixed(3)+"%";
        var dataArray = [$loanTerm, istring, help[0], help[1], help[2], help[3], help[4],
                    $hoi, help[5], help[6], help[7], help[8], tempArray[0],
                    tempArray[1], tempArray[2], tempArray[3]];
        for (var y = 0; y < dataArray.length; y++){
            var column = document.createElement("td");
            column.id = columnID;

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

            if (y == 15){
                var column = document.createElement("td");
                column.id = columnID;

                /*var bt = document.createElement('button');
                bt.className = "btn btn-success btn-sm";
                bt.setAttribute("onclick","saveTest('"+columnID+"')");
                bt.innerText = "Save";
                column.appendChild(bt);*/

                var bt = document.createElement('button');
                bt.className = "btn btn-danger btn-sm";
                bt.setAttribute("onclick","deleteTest('"+columnID+"')");
                bt.innerText = "Delete";
                column.appendChild(bt);

                rowArray[16].appendChild(column);
            }
            
            //rowArray[y].appendChild(column);
        }

        for (var z = 0; z < rowArray.length; z++){
            $table8.append(rowArray[z]);
        }
        columnID++;
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


function test(hc, dp, lt, ir, hoa, ptr, pmi, hoi, ep){
    
    var monthlyPropertyTax = ((ptr/100)*hc)/12;
    var downPaymentAmount = (dp/100)*hc;
    var P = hc - downPaymentAmount;
    var i = ir/100/12;
    var n = lt*12;
    var M = ep + P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
    var monthlyPMI = 0;
    if (dp < 20){
        monthlyPMI = ((pmi/100)*P)/12;
    }
    var totalMonthlyPayment = M + hoa + monthlyPropertyTax + monthlyPMI + hoi;
    var newP = P;
    var interestPayment = 0;
    var totalInterest = 0;
    var newPMI = 0;
    var principalPayment = 0;
    var totalPMI = 0;
    var equity = 0;

    for (var j = 0; j < n; j++){
            interestPayment = newP*i;
            totalInterest = totalInterest + interestPayment;
            principalPayment = M - interestPayment;
            newP = newP - principalPayment;
            if (newP/hc > .8){
                totalPMI = totalPMI + monthlyPMI;
                equity = equity + 1;
            }
    }
    return [downPaymentAmount, P, M, monthlyPropertyTax, monthlyPMI, totalMonthlyPayment, totalPMI, equity, totalInterest];
}
function deleteTest(x){
    var a = '[id="'+x+'"]';
    $(a).remove();
}