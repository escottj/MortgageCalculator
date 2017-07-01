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

//$("#help-block").toggle();

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


/*$("#hoa").keyup(function (e) {
    if (this.id == "hoa"){
        if (+$(this).val() >= 100 || +$(this).val() == ""){
            $("#hoa-help-block").show();
            $("#hoa-group").attr('class', 'form-group form-group-md nopadding has-error required');
            $("#hoa-glyph").attr('class', 'glyphicon glyphicon-remove form-control-feedback');
        }else{
            $("#hoa-help-block").hide();
            $("#hoa-group").attr('class', 'form-group form-group-md nopadding has-success required');
            $("#hoa-glyph").attr('class', 'glyphicon glyphicon-ok form-control-feedback');
        }
    }
});*/

$("#home-cost, #down-payment-dollars, #down-payment, #hoa, #property-tax-rate, #pmi, #hoi, #extra-payment, [id^=interest-rate-]").focusout(function(){
    var x = removeCommas($(this).val());
    var $homeCost = $('#home-cost').val().replace(/,/g,"");
    var $downPaymentDollars = $('#down-payment-dollars').val().replace(/,/g,"");
    var $downPayment = $('#down-payment').val();
    var $loanTerm = 10;
    var loanTermArray = [10, 15, 20, 30];
    if ($loanTerm != 0){
        var $interestRate = $('#interest-rate-'+$loanTerm).val();
    } else {
        var interestArray = [$('#interest-rate-10').val(),
                             $('#interest-rate-15').val(),
                             $('#interest-rate-20').val(),
                             $('#interest-rate-30').val()];
    }
    var $hoa = $('#hoa').val().replace(/,/g,"");
    var $propertyTaxRate = $('#property-tax-rate').val();
    var $pmi = $('#pmi').val();
    var $hoi = $('#hoi').val().replace(/,/g,"");
    var $extraPayment = $('#extra-payment').val().replace(/,/g,"");

    /*if (x.length == 0){
        validate = 0;
        if (this.id == "down-payment-dollars" || this.id == "down-payment"){
            if ($downPaymentDollars.length == 0){
                textRequired("down-payment-dollars", "required", "right");
                $("#down-payment-label").css("color", "#a94442");
            }
            if ($downPayment == 0){
                textRequired("down-payment", "required", "left");
                $("#down-payment-label").css("color", "#a94442");
            }
        } else if (this.id == "home-cost"){
            textRequired(this.id, "required", "right");
        } else if (this.id == "property-tax-rate" || this.id == "hoi"){
            textRequired(this.id, "required", "left");
        }
    } else {*/
        switch(this.id){
            case "home-cost":
                if (x.length == 0){
                    textRequired(this.id, "required", "right");
                } else {
                    if (+x < 10000 || +x > 1000000000){
                        validate = 0;
                        wrongText(this.id, "required", "right");
                    } else {
                        correctText(this.id, "required", "right");
                    }
                }
                break;
            case "down-payment-dollars":
                if (x.length == 0){
                    textRequired("down-payment-dollars", "required", "right");
                    $("#down-payment-label").css("color", "#a94442");
                    if ($downPayment.length == 0){
                        textRequired("down-payment", "required", "left");
                        $("#down-payment-label").css("color", "#a94442");
                    }
                } else {
                    var $homeCost = $('#home-cost').val().replace(/,/g,"");
                    var $downPayment = $('#down-payment').val();
                    if ($homeCost.length == 0){
                        correctText(this.id, "required", "right");
                        if ($downPayment.length == 0){
                            $('#down-payment').val(0);
                        }
                        correctText("down-payment", "required", "left");
                        $("#down-payment-label").css("color", "#3c763d");
                    } else {
                        if (+x >= +$homeCost){
                            validate = 0;
                            wrongText(this.id, "required", "right");
                            wrongText("down-payment", "required", "left");
                            $("#down-payment-label").css("color", "#a94442");
                        } else {
                            correctText(this.id, "required", "right");
                            correctText("down-payment", "required", "left");
                            $("#down-payment-label").css("color", "#3c763d");
                        }
                    }
                }
                break;
            case "down-payment":
                if (x.length == 0){
                    textRequired("down-payment", "required", "left");
                    $("#down-payment-label").css("color", "#a94442");
                    if ($downPaymentDollars.length == 0){
                        textRequired("down-payment-dollars", "required", "right");
                        $("#down-payment-label").css("color", "#a94442");
                    }
                } else {
                    if (+x >= 100 ){
                        validate = 0;
                        wrongText(this.id, "required", "left");
                        wrongText("down-payment-dollars", "required", "right");
                        $("#down-payment-label").css("color", "#a94442");
                    } else {
                        correctText(this.id, "required", "left");
                        correctText("down-payment-dollars", "required", "right");
                        $("#down-payment-label").css("color", "#3c763d");
                    }
                }
                break;
            case "hoa":
                if (+$hoa > 1000 ){
                    validate = 0;
                    wrongText(this.id, "", "center");
                } else {
                    correctText(this.id, "", "center");
                }
                break;
            case "property-tax-rate":
                if (+$propertyTaxRate > 10 ){
                    validate = 0;
                    wrongText(this.id, "required", "left");
                } else {
                    correctText(this.id, "required", "left");
                }
                break;
            case "pmi":
                if (+$pmi > 10 ){
                    validate = 0;
                    wrongText(this.id, "", "left");
                } else {
                    correctText(this.id, "", "left");
                }
                break;
            case "hoi":
                if (+$hoi > 1000 ){
                    validate = 0;
                    wrongText(this.id, "required", "center");
                } else {
                    correctText(this.id, "required", "center");
                }
                break;
            case "extra-payment":
                if (+$extraPayment >= $homeCost - $downPaymentDollars){
                    validate = 0;
                    wrongText(this.id, "", "center");
                } else {
                    correctText(this.id, "", "center");
                }
                break;
        }
    //}   
});

function myValidate(kl){
    var formArray = ["home-cost", "down-payment-dollars", "down-payment", "hoa", "property-tax-rate", "pmi", "hoi", "extra-payment"];
    var formGlypPositionArray = ["right", "right", "left", "center", "left", "left", "center", "center"];
    var formRequired = ["required", "required", "required", "", "required", "", "required", ""];
    var $homeCost = $('#home-cost').val().replace(/,/g,"");
    var $downPaymentDollars = $('#down-payment-dollars').val().replace(/,/g,"");
    var $downPayment = $('#down-payment').val();
    var $loanTerm = kl;
    var loanTermArray = [10, 15, 20, 30];
    if ($loanTerm != 0){
        var $interestRate = $('#interest-rate-'+$loanTerm).val();
    } else {
        var interestArray = [$('#interest-rate-10').val(),
                             $('#interest-rate-15').val(),
                             $('#interest-rate-20').val(),
                             $('#interest-rate-30').val()];
    }
    var $hoa = $('#hoa').val().replace(/,/g,"");
    var $propertyTaxRate = $('#property-tax-rate').val();
    var $pmi = $('#pmi').val();
    var $hoi = $('#hoi').val().replace(/,/g,"");
    var $extraPayment = $('#extra-payment').val().replace(/,/g,"");

    validate = 1;

    for (var j = 0; j < formArray.length; j++){
        var x = $('#'+formArray[j]).val().replace(/,/g,"");
        if (x.length == 0){
            if (formRequired[j] == "required"){
                validate = 0;
                textRequired(formArray[j], formRequired[j], formGlypPositionArray[j]);
            } else {
                textNotRequired(formArray[j], formRequired[j], formGlypPositionArray[j]);
            }
        } else {
            switch(formArray[j]){
                case "home-cost":
                    if (+$homeCost < 10000 || +$homeCost > 1000000000){
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "down-payment-dollars":
                    if (+$downPaymentDollars >= +$homeCost){
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "down-payment":
                    if (+$downPayment >= 100 ){
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "hoa":
                    if (+$hoa > 1000 ){
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "property-tax-rate":
                    if (+$propertyTaxRate > 10 ){
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "pmi":
                    if (+$pmi > 10 ){
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "hoi":
                    if (+$hoi > 1000 ){
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "extra-payment":
                    if (+$extraPayment >= $homeCost - $downPaymentDollars){
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
            }
        }
    }

    if ($loanTerm != 0){
        if ($interestRate.length == 0){
            validate = 0;
            textRequired('interest-rate-'+$loanTerm, "required", "left");
            $("#interest-rate-label").css("color", "#a94442");
        } else {
            if (+$interestRate >= 20){
                validate = 0;
                wrongText('interest-rate-'+$loanTerm, "required", "left");
                $("#interest-rate-label").css("color", "#a94442");
            } else {
                correctText('interest-rate-'+$loanTerm, "required", "left");
                $("#interest-rate-label").css("color", "#3c763d");
            }
        }

        for (var k = 0; k < loanTermArray.length; k++){
            if (+loanTermArray[k] != +$loanTerm){
                textNotRequired('interest-rate-'+loanTermArray[k], "required", "left");
            }
        }

    } else {
        var iTest = 0;
        for (var k = 0; k < interestArray.length; k++){
            if (interestArray[k].length == 0){
                validate = 0;
                textRequired('interest-rate-'+loanTermArray[k], "required", "left");
                iTest = 1;
            } else {
                if (+interestArray[k] >= 20){
                    validate = 0;
                    wrongText('interest-rate-'+loanTermArray[k], "required", "left");
                    iTest = 1;
                } else {
                    correctText('interest-rate-'+loanTermArray[k], "required", "left");
                }
            }
        }
        if (iTest == 1){
            $("#interest-rate-label").css("color", "#a94442");
        } else {
            $("#interest-rate-label").css("color", "#3c763d");
        }
    }


    return(validate);
}
function textNotRequired(x, y, z){
    $("#"+x+"-help-block").hide();
    if (x.match(/interest-rate-.*/)){
        $("#"+x+"-check").attr('class', 'col-sm-2');
    } else {
        $("#"+x+"-group").attr('class', 'form-group form-group-md nopadding '+y);
    }
    $("#"+x+"-glyph").attr('class', 'glyphicon form-control-feedback glyphicon-'+z);
    return;
}
function textRequired(x, y, z){
    $("#"+x+"-help-block").hide();
    if (x.match(/down-payment.*/)){
        $("#"+x+"-check").attr('class', 'col-sm-4 has-error');
    } else if (x.match(/interest-rate-.*/)){
        $("#"+x+"-check").attr('class', 'col-sm-2 has-error');
    } else {
        $("#"+x+"-group").attr('class', 'form-group form-group-md nopadding has-error '+y);
    }
    $("#"+x+"-glyph").attr('class', 'glyphicon form-control-feedback glyphicon-'+z);
    return;
}
function wrongText(x, y, z){
    $("#"+x+"-help-block").show();
    if (x.match(/down-payment.*/)){
        $("#"+x+"-check").attr('class', 'col-sm-4 has-error');
    } else if(x.match(/interest-rate-.*/)){
        $("#"+x+"-check").attr('class', 'col-sm-2 has-error');
    } else {
        $("#"+x+"-group").attr('class', 'form-group form-group-md nopadding has-error '+y);
    }
    $("#"+x+"-glyph").attr('class', 'glyphicon glyphicon-remove form-control-feedback glyphicon-'+z);
    return;
}
function correctText(x, y, z){
    $("#"+x+"-help-block").hide();
    if (x.match(/down-payment.*/)){
        $("#"+x+"-check").attr('class', 'col-sm-4 has-success');
    } else if(x.match(/interest-rate-.*/)){
        $("#"+x+"-check").attr('class', 'col-sm-2 has-success');
    } else {
        $("#"+x+"-group").attr('class', 'form-group form-group-md nopadding has-success '+y);
    }
    $("#"+x+"-glyph").attr('class', 'glyphicon glyphicon-ok form-control-feedback glyphicon-'+z);
    return;
}
/*$("#home-cost").focusout(function(){
    var x = $(this).val();
    var min = 0;
    var max = 0;
    if (this.id == "home-cost"){
        min = 10000;
        max = 1000000000;
    }else if (this.id == "down-payment-dollars"){
        min = 0;
        max = .8*removeCommas($("#home-cost").val());
    }
    if (x == "" || x < min || x > max){
        $("#"+this.id+"-help-block").show();
        $("#"+this.id+"-check").attr('class', 'col-sm-4 has-error');
        $("#"+this.id+"-glyph").attr('class', 'glyphicon glyphicon-remove form-control-feedback glyphicon-right');
    } else {
        $("#"+this.id+"-help-block").hide();
        $("#"+this.id+"-check").attr('class', 'col-sm-4 has-success');
        $("#"+this.id+"-glyph").attr('class', 'glyphicon glyphicon-ok form-control-feedback glyphicon-right');
        if (this.id == "home-cost"){
            if ($("#down-payment-dollars").val() == "" || $("#down-payment-dollars").val() == 0){
                if ($("#down-payment").val() == ""){
                    $("#down-payment-dollars").val(addCommas(.2*$(this).val()));
                    $("#down-payment-dollars-help-block").hide();
                    $("#down-payment-dollars-check").attr('class', 'col-sm-4 has-success');
                    $("#down-payment-dollars-glyph").attr('class', 'glyphicon glyphicon-ok form-control-feedback glyphicon-right');
                    $("#down-payment").val("20.000");
                    $("#down-payment-help-block").hide();
                    $("#down-payment-check").attr('class', 'col-sm-4 has-success');
                    $("#down-payment-glyph").attr('class', 'glyphicon glyphicon-ok form-control-feedback glyphicon-left');
                }
            }
        }
        $(this).val(addCommas($(this).val()));
    }
});

$("#down-payment-dollars").focusout(function(){
    var x = +removeCommas($(this).val());
    var min = 0;
    var max = 0;
    var test = +removeCommas($("#home-cost").val());
    if (test == ""){
        $("#"+this.id+"-help-block").hide();
        $("#"+this.id+"-check").attr('class', 'col-sm-4');
        $("#"+this.id+"-glyph").attr('class', 'glyphicon form-control-feedback glyphicon-right');
    } else if (x >= test) {
        $("#"+this.id+"-help-block").show();
        $("#"+this.id+"-check").attr('class', 'col-sm-4 has-error');
        $("#"+this.id+"-glyph").attr('class', 'glyphicon glyphicon-remove form-control-feedback glyphicon-right');
    } else {
        $("#"+this.id+"-help-block").hide();
        $("#"+this.id+"-check").attr('class', 'col-sm-4 has-success');
        $("#"+this.id+"-glyph").attr('class', 'glyphicon glyphicon-ok form-control-feedback glyphicon-right');
    }
    $(this).val(addCommas($(this).val()));
});*/



$("#home-cost, #extra-payment, #hoa, #hoi, #down-payment-dollars").focusout(function(){
    var a = $(this);
    var x = removeCommas(a.val());
    if (x.length != 0){
        a.val(addCommas(x));
        if (this.id == "down-payment-dollars"){
            var $homeCost = removeCommas($("#home-cost").val());
            if ($homeCost != ""){
                var newdp = (x/$homeCost)*100;
                $("#down-payment").val(Number(Math.round(newdp+'e3')+'e-3').toFixed(3));
            }
        }
        if (this.id == "home-cost"){
            var $homeCost = removeCommas($("#home-cost").val());
            if ($homeCost != ""){
                var dp = $("#down-payment").val().replace("%","");
                if (dp.length != 0){
                    var newdp = (dp/100)*$homeCost;
                    var y = addCommas(Number(Math.round(newdp)));
                    $("#down-payment-dollars").val(y);
                }
            }
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

function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function removeCommas(x) {
    return x.toString().replace(/,/g,"").replace("$","");
}



function calculate(kl){
        var validate = myValidate(kl);
        if (validate == 0){
            return;
        }
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