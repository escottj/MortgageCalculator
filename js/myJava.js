//Google Charts Global Variables
var gData2 = {};
var gArrayID = ["Loan"];
var gArrayMortgage = ["Mortgage"];
var gArrayMonthlyPropertyTax = ["Property Tax"];
var gArrayTotalInterest = ["Total Interest"];


var columnID = 0;
var textArray = ["Loan Details", "Loan Term", "Interest Rate", "Down Payment", "Loan Amount", 
                 "Monthly Payment Breakdown", "Monthly Mortgage Payment", "Monthly Property Tax", "Monthly Home Owner's Insurance",
                 "Monthly PMI", "Monthly HOA", "Total Monthly Payment",
                 "Early Mortgage Payoff", "Extra Monthly Payment", "Months Until Mortgage is Paid Off", "Total Interest Paid", "Total Interest Savings",
                 "PMI Details", "Months Until 20% Equity", "Total PMI Paid",
                 "Total Interest Paid", "If Paid Off in 10 years", "If Paid Off in 15 years", "If Paid Off in 20 years", "If Paid Off in 30 years",
                 "Total Out Of Pocket Cost Over Life of Loan", "Total Cost (w/o Extra Payment)", "Total Cost (w/ Extra Payment)", ""];

var $table8 = $("#table8");
var rowArray = [];
for (var x = 0; x < textArray.length; x++){
    var row = document.createElement("tr");
    var column = document.createElement("th");
    var text = document.createTextNode(textArray[x]);
    column.appendChild(text);
    if (textArray[x] == ""){
        column.setAttribute("style", "background-color: white;");
    } else if (x == 0 || x == 5 || x == 12 || x == 17 || x == 20 || x == 25) {
        column.className = "mergedTitle";
        column.setAttribute("colspan", "100%");
    }
    row.appendChild(column);
    rowArray.push(row);
}

//Google Charts
function drawVisualization() {
    var $container = $('#charts');
    var activeCheck = 0;
    if ($container.hasClass("active")) {
        activeCheck = 1;
    } else {
        $container.addClass("active");
    }
    // Some raw data (not necessarily accurate)
    /*var data = google.visualization.arrayToDataTable([
        ['Loan', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'],
        ['Total Monthly Payment', 165,      938,         522,             998,           450,      614.6],
        ['Mortgage',              135,      1120,        599,             1268,          288,      682],
        ['Total Interest',        157,      1167,        587,             807,           397,      623],
        ['Total PMI',             139,      1110,        615,             968,           215,      609.4],
        ['Total Cost',            139,      1110,        615,             968,           215,      609.4]
    ]);

    data.addRows([
        ['New Cost', 100, 200, 300, 400, 500, 600]
    ]);*/
    var data = google.visualization.arrayToDataTable([
        gArrayID,
        gArrayMortgage,
        gArrayMonthlyPropertyTax,
        gArrayTotalInterest
    ]);

    var options = {
        title : 'Loan Comparison',
        vAxis: {title: '$'},
        hAxis: {title: 'Cost'},
        seriesType: 'bars',
        //series: {5: {type: 'line'}}
    };

    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    google.visualization.events.addListener(chart, 'ready', function () {
        if (activeCheck == 0) {
            $container.removeClass("active");
            $('#table').addClass("active");
        }
    });
    chartStyle = $("#chart_div").css({"width":"1000px", "height":"500px"})
    chart.draw(data, options);
}



function resetAll() {
    //Google Charts Clear
    gArrayID = ["Loan"];
    gArrayMortgage = ["Mortgage"];
    gArrayMonthlyPropertyTax = ["Property Tax"];
    gArrayTotalInterest = ["Total Interest"];
    $("#chart_div").empty();

    $("#table8").empty();
    rowArray = [];
    for (var x = 0; x < textArray.length; x++){
        var row = document.createElement("tr");
        var column = document.createElement("th");
        var text = document.createTextNode(textArray[x]);
        column.appendChild(text);
        if (textArray[x] == ""){
            column.setAttribute("style", "background-color: white;");
        } else if (x == 0 || x == 5 || x == 12 || x == 17 || x == 20 || x == 25) {
            column.className = "mergedTitle";
            column.setAttribute("colspan", "100%");
        }
        row.appendChild(column);
        rowArray.push(row);
    }
};

//Delete Column
function deleteCol(x){
    var a = '[id="'+x+'"]';
    $(a).remove();
    if (gArrayID.length == 2) {
        gArrayID = ["Loan"];
        gArrayMortgage = ["Mortgage"];
        gArrayMonthlyPropertyTax = ["Property Tax"];
        gArrayTotalInterest = ["Total Interest"];
        $("#chart_div").empty();
    } else {
        for (var h = 0; h < gArrayID.length; h++) {
            if (gArrayID[h] == x) {
                gArrayID.splice(h, 1);
                gArrayMortgage.splice(h, 1);
                gArrayMonthlyPropertyTax.splice(h, 1);
                gArrayTotalInterest.splice(h, 1);
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawVisualization);
            }
        }
    }
}

//Number Validation
//Monetary Amounts
$("#home-cost, #extra-payment, #hoa, #hoi, #down-payment-dollars").keypress(function (e) {
    var charCode = e.keyCode;
    var number = $(this).val().split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if(number.length > 1 && charCode == 46){
        return false;
    }
    var caratPos = getSelectionStart(this);
    var dotPos = $(this).val().indexOf(".");
    
    if( caratPos > dotPos && dotPos > -1 && (number[1].length > 1)){
        return false;
    }
    return true;
    function getSelectionStart(o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate()
            r.moveEnd('character', o.value.length)
            if (r.text == '') return o.value.length
            return o.value.lastIndexOf(r.text)
        } else return o.selectionStart
    }
});

//Percentages
$("#down-payment, [id^=interest-rate-], #property-tax-rate, #pmi").keypress(function (e) {
    var charCode = e.keyCode;
    var number = this.value.split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if(number.length > 1 && charCode == 46){
        return false;
    }
    var caratPos = getSelectionStart(this);
    var dotPos = this.value.indexOf(".");
    
    if( caratPos > dotPos && dotPos > -1 && (number[1].length > 2)){
        return false;
    }
    return true;
    function getSelectionStart(o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate()
            r.moveEnd('character', o.value.length)
            if (r.text == '') return o.value.length
            return o.value.lastIndexOf(r.text)
        } else return o.selectionStart
    }
});

$("#home-cost, #down-payment-dollars, #down-payment, #hoa, #property-tax-rate, #pmi, #hoi, #extra-payment, [id^=interest-rate-]").focusout(function(){
    var x = removeCommas($(this).val());
    var $homeCost = $('#home-cost').val().replace(/,/g,"");
    var $downPaymentDollars = $('#down-payment-dollars').val().replace(/,/g,"");
    var $downPayment = $('#down-payment').val();
    var $loanTerm = 10;
    var loanTermArray = [10, 15, 20, 30];
    //Check if Mobile
    if ($('#interest-rate-apr').is(':visible')) {
        //Mobile
        if ($loanTerm != 0){
            var $interestRate = +$('#interest-rate-apr').val().replace("%","");
        } else {
            var interestArray = [+$('#interest-rate-apr').val().replace("%",""),
                                 +$('#interest-rate-apr').val().replace("%",""),
                                 +$('#interest-rate-apr').val().replace("%",""),
                                 +$('#interest-rate-apr').val().replace("%","")];
        }
    } else {
        //Desktop
        if ($loanTerm != 0){
            var $interestRate = +$('#interest-rate-'+$loanTerm).val().replace("%","");
        } else {
            var interestArray = [+$('#interest-rate-10').val().replace("%",""),
                                +$('#interest-rate-15').val().replace("%",""),
                                +$('#interest-rate-20').val().replace("%",""),
                                +$('#interest-rate-30').val().replace("%","")];
        }
    }
    var $hoa = $('#hoa').val().replace(/,/g,"");
    var $propertyTaxRate = $('#property-tax-rate').val();
    var $pmi = $('#pmi').val();
    var $hoi = $('#hoi').val().replace(/,/g,"");
    var $extraPayment = $('#extra-payment').val().replace(/,/g,"");

    var validate = 0;
    switch(this.id){
        case "home-cost":
            if (x.length == 0){
                textRequired(this.id, "required", "right");
            } else {
                if (+x < 10000 || +x > 1000000000){
                    validate = 0;
                    wrongText(this.id, "required", "right");
                } else {
                    if ($downPaymentDollars.length > 0 && $downPayment.length == 0){
                        $('#down-payment').val(((+$downPaymentDollars/+x)*100).toFixed(3));
                        correctText("down-payment", "required", "left");
                        $("#down-payment-label").css("color", "#3c763d");
                    } else if ($downPayment.length > 0){
                        $('#down-payment-dollars').val(addCommas(+$downPayment*+x));
                        correctText("down-payment-dollars", "required", "right");
                        $("#down-payment-label").css("color", "#3c763d");
                        correctText("down-payment", "required", "left");
                    }
                    correctText(this.id, "required", "right");
                }
            }
            break;
        case "down-payment-dollars":
            if (x.length == 0){
                if ($downPayment.length == 0){
                    textRequired("down-payment-dollars", "required", "right");
                    $("#down-payment-label").css("color", "#a94442");
                    textRequired("down-payment", "required", "left");
                    textNotRequired("pmi", "", "left");
                } else {
                    $("#down-payment-dollars").val(addCommas((+$downPayment/100)*$homeCost));
                    correctText("down-payment-dollars", "required", "right");
                    $("#down-payment-label").css("color", "#3c763d");
                    if (+$downPayment < 20){
                        $("#pmi-group").attr('class', 'form-group form-group-md nopadding required')
                    } else {
                        $("#pmi-group").attr('class', 'form-group form-group-md nopadding')
                    }
                    correctText("down-payment", "required", "left");
                }
            } else {
                if ($homeCost.length == 0){
                    correctText(this.id, "required", "right");
                    if ($downPayment.length == 0){
                        //$('#down-payment').val("0.000");
                    } else {
                        correctText("down-payment", "required", "left");
                    }
                    
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
                        $("#down-payment").val(((+$downPaymentDollars/+$homeCost)*100).toFixed(3));
                        $downPayment = $('#down-payment').val();
                        if (+$downPayment < 20){
                            $("#pmi-group").attr('class', 'form-group form-group-md nopadding required')
                        } else {
                            $("#pmi-group").attr('class', 'form-group form-group-md nopadding')
                        }
                    }
                }
            }
            break;
        case "down-payment":
            if (x.length == 0){
                if ($downPaymentDollars.length == 0){
                    textRequired("down-payment", "required", "left");
                    $("#down-payment-label").css("color", "#a94442");
                    textRequired("down-payment-dollars", "required", "right");
                    textNotRequired("pmi", "", "left");
                } else {
                    if (+$homeCost >= 10000 && +$homeCost <= 1000000000){
                        $("#down-payment").val(((+$downPaymentDollars/+$homeCost)*100).toFixed(3));
                        correctText("down-payment", "required", "right");
                        $("#down-payment-label").css("color", "#3c763d");
                        $downPayment = $('#down-payment').val();
                        if (+$downPayment < 20){
                            $("#pmi-group").attr('class', 'form-group form-group-md nopadding required')
                        } else {
                            $("#pmi-group").attr('class', 'form-group form-group-md nopadding')
                        }
                        correctText("down-payment-dollars", "required", "right");
                    } else {
                        textRequired("down-payment", "required", "left");
                    }
                }
            } else {
                if (+x >= 100 ){
                    validate = 0;
                    wrongText(this.id, "required", "left");
                    wrongText("down-payment-dollars", "required", "right");
                    $("#down-payment-label").css("color", "#a94442");
                } else {
                    if (+x >= 20){
                        textNotRequired("pmi", "", "left");
                    } else {
                        if ($pmi.length > 0){
                            if (+$pmi > 10){
                                wrongText("pmi", "required", "left");
                            } else {
                                correctText("pmi", "required", "left");
                            }
                        } else {
                            if ($('#pmi-group').hasClass("has-error")){

                            } else {
                                $("#pmi-group").attr('class', 'form-group form-group-md nopadding required');
                            }
                        }
                    }
                    correctText(this.id, "required", "left");
                    correctText("down-payment-dollars", "required", "right");
                    $("#down-payment-label").css("color", "#3c763d");
                }
            }
            break;
        case "hoa":
            if (x.length == 0){
                textNotRequired(this.id, "", "center");
            } else {
                if (+$hoa > 1000 ){
                    validate = 0;
                    wrongText(this.id, "", "center");
                } else {
                    correctText(this.id, "", "center");
                }
            }

            break;
        case "property-tax-rate":
            if (x.length == 0){
                textRequired(this.id, "required", "left");
            } else {
                if (+$propertyTaxRate > 10 ){
                    validate = 0;
                    wrongText(this.id, "required", "left");
                } else {
                    correctText(this.id, "required", "left");
                }
            }
            break;
        case "pmi":
            if (x.length == 0){
                if ($downPayment.length > 0){
                    if (+$downPayment >= 20){
                        textNotRequired(this.id, "", "left");
                    } else {
                        textRequired(this.id, "required", "left");
                        $("#pmi-group").attr('class', 'form-group form-group-md nopadding required has-error');
                    }
                } else {
                    textNotRequired("pmi", "", "left");
                }
            } else {
                if ($downPayment.length > 0){
                    if (+$downPayment >= 20){
                        textNotRequired("pmi", "", "left");
                    } else {
                        if (+$pmi > 10 ){
                            validate = 0;
                            wrongText(this.id, "required", "left");
                        } else {
                            correctText(this.id, "required", "left");
                        }
                    }
                } else {
                    textNotRequired(this.id, "", "left");
                }
            }
            break;
        case "hoi":
            if (x.length == 0){
                textRequired(this.id, "required", "center");
            } else {
                if (+$hoi > 1000 ){
                    validate = 0;
                    wrongText(this.id, "required", "center");
                } else {
                    correctText(this.id, "required", "center");
                }
            }
            break;
        case "extra-payment":
            if (x.length == 0){
                textNotRequired(this.id, "", "center");
            } else {
                if (+$extraPayment > 5000){
                    validate = 0;
                    wrongText(this.id, "", "center");
                } else {
                    correctText(this.id, "", "center");
                }
            }
            break;
    }
    return(validate);
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
    //Check if Mobile
    if ($('#interest-rate-apr').is(':visible')) {
        //Mobile
        if ($loanTerm != 0){
            var $interestRate = $('#interest-rate-apr').val().replace("%","");
        } else {
            var interestArray = [$('#interest-rate-apr').val().replace("%",""),
                                 $('#interest-rate-apr').val().replace("%",""),
                                 $('#interest-rate-apr').val().replace("%",""),
                                 $('#interest-rate-apr').val().replace("%","")];
        }
    } else {
        //Desktop
        if ($loanTerm != 0){
            var $interestRate = $('#interest-rate-'+$loanTerm).val().replace("%","");
        } else {
            var interestArray = [$('#interest-rate-10').val().replace("%",""),
                                 $('#interest-rate-15').val().replace("%",""),
                                 $('#interest-rate-20').val().replace("%",""),
                                 $('#interest-rate-30').val().replace("%","")];
        }
    }
    var $hoa = $('#hoa').val().replace(/,/g,"");
    var $propertyTaxRate = $('#property-tax-rate').val();
    var $pmi = $('#pmi').val();
    var $hoi = $('#hoi').val().replace(/,/g,"");
    var $extraPayment = $('#extra-payment').val().replace(/,/g,"");

    var validate = 1;

    for (var j = 0; j < formArray.length; j++){
        var x = $('#'+formArray[j]).val().replace(/,/g,"");
        if (x.length == 0){
            if (formRequired[j] == "required"){
                validate = 0;
                textRequired(formArray[j], formRequired[j], formGlypPositionArray[j]);
                if (formArray[j] == "down-payment-dollars"){
                    $("#down-payment-label").css("color", "#a94442");
                }
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
                    if (+$homeCost >= 10000 && +$homeCost <= 1000000000){
                        if (+$downPaymentDollars >= +$homeCost){
                            validate = 0;
                            wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                            $("#down-payment-label").css("color", "#a94442");
                        } else {
                            correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                            $("#down-payment-label").css("color", "#3c763d");
                        }
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
                    if (+$extraPayment > 5000){
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
            }
        }
    }
    
    //Check if Mobile
    if ($('#interest-rate-apr').is(':visible')) {
        //Mobile
        if ($loanTerm != 0){
            if ($interestRate.length == 0){
                validate = 0;
                textRequired('interest-rate-apr', "required", "left");
                $("#interest-rate-apr-label").css("color", "#a94442");
            } else {
                if (+$interestRate >= 20){
                    validate = 0;
                    wrongText('interest-rate-apr', "required", "left");
                    $("#interest-rate-apr-label").css("color", "#a94442");
                } else {
                    correctText('interest-rate-apr', "required", "left");
                    $("#interest-rate-apr-label").css("color", "#3c763d");
                }
            }
        } else {
            var iTest = 0;
            for (var k = 0; k < interestArray.length; k++){
                if (interestArray[k].length == 0){
                    validate = 0;
                    textRequired('interest-rate-apr', "required", "left");
                    iTest = 1;
                } else {
                    if (+interestArray[k] >= 20){
                        validate = 0;
                        wrongText('interest-rate-apr', "required", "left");
                        iTest = 1;
                    } else {
                        correctText('interest-rate-apr', "required", "left");
                    }
                }
            }
            if (iTest == 1){
                $("#interest-rate-apr-label").css("color", "#a94442");
            } else {
                $("#interest-rate-apr-label").css("color", "#3c763d");
            }
        }
    } else {
        //Desktop
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

$("#home-cost, #extra-payment, #hoa, #hoi, #down-payment-dollars").focusout(function(){
    var a = $(this);
    var x = removeCommas(a.val());
    if (x.length != 0){
        x = Number(x).toFixed(2);
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
                    var y = addCommas(Number(Math.round(newdp)).toFixed(2));
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
            var newDownPaymentDollars = ((temp/100)*$homeCost);
            var y = addCommas(Number(newDownPaymentDollars).toFixed(2));
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
    //Validate Form Fields
    var validate = myValidate(kl);
    if (validate == 0){
        return;
    }

    //Compare All Table
    var $homeCost = +$('#home-cost').val().replace(/,/g,"").replace("$","");
    var $downPaymentDollars = +$('#down-payment-dollars').val().replace(/,/g,"").replace("$","");
    var $downPayment = +$('#down-payment').val().replace("%","");
    var $loanTerm = kl;

    //Check if Mobile
    if ($('#interest-rate-apr').is(':visible')) {
        //Mobile
        if ($loanTerm != 0){
            var $interestRate = +$('#interest-rate-apr').val().replace("%","");
        } else {
            var interestArray = [+$('#interest-rate-apr').val().replace("%",""),
                                 +$('#interest-rate-apr').val().replace("%",""),
                                 +$('#interest-rate-apr').val().replace("%",""),
                                 +$('#interest-rate-apr').val().replace("%","")];
        }
    } else {
        //Desktop
        if ($loanTerm != 0){
            var $interestRate = +$('#interest-rate-'+$loanTerm).val().replace("%","");
        } else {
            var interestArray = [+$('#interest-rate-10').val().replace("%",""),
                                +$('#interest-rate-15').val().replace("%",""),
                                +$('#interest-rate-20').val().replace("%",""),
                                +$('#interest-rate-30').val().replace("%","")];
        }
    }

    var $hoa = +$('#hoa').val().replace(/,/g,"").replace("$","");
    var $propertyTaxRate = +$('#property-tax-rate').val().replace("%","");
    var $pmi = +$('#pmi').val().replace("%","");
    var $hoi = +$('#hoi').val().replace(/,/g,"").replace("$","");
    var $extraPayment = +$('#extra-payment').val().replace(/,/g,"").replace("$","");
    var termArray = [10, 15, 20, 30];

    if ($loanTerm == 0){
        for (var t = 0; t < termArray.length; t++){
            var dict = loanPayment($homeCost, $downPayment, termArray[t], interestArray[t], $hoa, $propertyTaxRate, $pmi, $hoi, $extraPayment);
            //var googleSend = $homeCost + ";" + $downPayment + ";" + $propertyTaxRate + ";" + $hoi + ";" + $pmi + ";" + $hoa + ";" + $extraPayment + ";" + interestArray[t] + ";" + termArray[t];
            //ga('send', 'event', 'Calculations', 'Calculate', googleSend);
            var lt = termArray[t];
            var i = interestArray[t]/100/12;
            var n = termArray[t]*12;
            var tempArray = [];
            var temploop = [10, 15, 20, 30];
            for (var w = 0; w < temploop.length; w++){
                if (lt >= temploop[w]){
                    var tentemp = earlymploop2(temploop[w], lt, i);
                    tempArray.push(tentemp[2]);
                } else {
                    tempArray.push(0);
                }
            }

            var istring =  Number(Math.round(interestArray[t]+'e3')+'e-3').toFixed(3)+"%";
            var dataArray = ["Loan Details", termArray[t], istring, dict["downPaymentAmount"], dict["loanAmount"],
                            "Monthly Payment Breakdown", dict["monthlyMortgagePayment"], dict["monthlyPropertyTax"], $hoi, dict["monthlyPMI"], $hoa, dict["totalMonthlyPayment"],
                            "Early Mortgage Payoff", $extraPayment, dict["mdcount"], dict["totalInterest2"], dict["totalSavings"],
                            "PMI Details", dict["equity"], dict["totalPMI"],
                            "Total Interest Paid", tempArray[0], tempArray[1], tempArray[2], tempArray[3],
                            "Total Out Of Pocket Cost Over Life of Loan", dict["totalCost"], dict["totalCost2"]];
            for (var y = 0; y < dataArray.length; y++){
                if (y != 0 && y != 5 && y != 12 && y != 17 && y != 20 && y != 25){
                    var column = document.createElement("td");
                    column.id = columnID;
                    if (y == 1){
                        var text = document.createTextNode(dataArray[y]+" years");
                    } else if (y == 2 || y == 14 || y == 18){
                        var text = document.createTextNode(dataArray[y]);
                    } else {
                        var text = document.createTextNode("$"+addCommas(dataArray[y].toFixed(2)));
                    }
                    column.appendChild(text);
                    rowArray[y].appendChild(column);

                    if (y == dataArray.length - 1){
                        var column = document.createElement("td");
                        column.id = columnID;

                        var bt = document.createElement('button');
                        bt.className = "btn btn-danger btn-sm";
                        bt.setAttribute("onclick","deleteCol('"+columnID+"')");
                        bt.innerText = "Delete";
                        column.appendChild(bt);
                        column.setAttribute("style", "background-color: white;");
                        column.setAttribute("align", "center");

                        rowArray[dataArray.length].appendChild(column);
                    }
                }
            }
            for (var z = 0; z <= rowArray.length; z++){
                $table8.append(rowArray[z]);
            }
            columnID++;
        }
    } else {
        var dict = loanPayment($homeCost, $downPayment, $loanTerm, $interestRate, $hoa, $propertyTaxRate, $pmi, $hoi, $extraPayment);
        //var googleSend = $homeCost + ";" + $downPayment + ";" + $propertyTaxRate + ";" + $hoi + ";" + $pmi + ";" + $hoa + ";" + $extraPayment + ";" + $interestRate + ";" + $loanTerm;
        //ga('send', 'event', 'Calculations', 'Calculate', googleSend);
        var tempArray = [];
        var temploop = [10, 15, 20, 30];
        var n = $loanTerm*12;
        var i = $interestRate/100/12;
        for (var w = 0; w < temploop.length; w++){
            if ($loanTerm >= temploop[w]){
                var tentemp = earlymploop2(temploop[w], $loanTerm, i);
                tempArray.push(tentemp[2]);
            } else {
                tempArray.push(0);
            }
        }
        var istring =  Number(Math.round($interestRate+'e3')+'e-3').toFixed(3)+"%";
        var dataArray = ["Loan Details", $loanTerm, istring, dict["downPaymentAmount"], dict["loanAmount"],
                         "Monthly Payment Breakdown", dict["monthlyMortgagePayment"], dict["monthlyPropertyTax"], $hoi, dict["monthlyPMI"], $hoa, dict["totalMonthlyPayment"],
                         "Early Mortgage Payoff", $extraPayment, dict["mdcount"], dict["totalInterest2"], dict["totalSavings"],
                         "PMI Details", dict["equity"], dict["totalPMI"],
                         "Total Interest Paid", tempArray[0], tempArray[1], tempArray[2], tempArray[3],
                         "Total Out Of Pocket Cost Over Life of Loan", dict["totalCost"], dict["totalCost2"]];
        for (var y = 0; y < dataArray.length; y++){
            if (y != 0 && y != 5 && y != 12 && y != 17 && y != 20 && y != 25){
                var column = document.createElement("td");
                column.id = columnID;
                if (y == 1){
                    var text = document.createTextNode(dataArray[y]+" years");
                } else if (y == 2 || y == 14 || y == 18){
                    var text = document.createTextNode(dataArray[y]);
                } else {
                    var text = document.createTextNode("$"+addCommas(dataArray[y].toFixed(2)));
                }
                column.appendChild(text);
                rowArray[y].appendChild(column);

                if (y == dataArray.length - 1){
                    var column = document.createElement("td");
                    column.id = columnID;

                    var bt = document.createElement('button');
                    bt.className = "btn btn-danger btn-sm";
                    bt.setAttribute("onclick","deleteCol('"+columnID+"')");
                    bt.innerText = "Delete";
                    column.appendChild(bt);
                    column.setAttribute("style", "background-color: white;");
                    column.setAttribute("align", "center");

                    rowArray[dataArray.length].appendChild(column);
                }
            }
        }

        for (var z = 0; z < rowArray.length; z++){
            $table8.append(rowArray[z]);
        }
        columnID++;

    //Create Google Chart

        //Google Chart Data
        var gData = {};
        gData["Mortgage"] = +dict["monthlyMortgagePayment"].toFixed(2);
        gData["Property Tax"] = +dict["monthlyPropertyTax"].toFixed(2);
        gData["Home Owner's Insurance"] = $hoi;
        gData["HOA"] = $hoa;
        gData["PMI"] = +dict["monthlyPMI"].toFixed(2);

        //Chart 1
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(googleChart);

        function googleChart() {

            var data = google.visualization.arrayToDataTable([
                //['Monthly Payment', '$'],
                //['test', 0]
            ]);

            data.addColumn('string', 'Monthly Payment');
            data.addColumn('number', '$');

            for (var key in gData) {
                data.addRows([
                    [key, gData[key]]
                ]);
            }
            /*var data = google.visualization.arrayToDataTable([
                ['Monthly Payment', '$'],
                //['Mortgage: $'+addCommas(gData["Mortgage"]), gData["Mortgage"]],
                ['Mortgage', gData["Mortgage"]],
                ['Property Tax', gData["Property Tax"]],
                ["Home Owner's Insurance", gData["Home Owner's Insurance"]],
                ['HOA', gData["HOA"]],
                ['PMI', gData["PMI"]]
            ]);*/
            var options = {
                title: 'Monthly Payment Breakdown',
                is3D: true,
                //pieSliceText: 'value-and-percentage',
            };
            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            chartStyle = $("#piechart").css({"width":"900px", "height":"500px"})
            chart.draw(data, options);
        }

        //Chart 2
        gData2["Mortgage"] = +dict["monthlyMortgagePayment"].toFixed(2);
        gData2["Property Tax"] = +dict["monthlyPropertyTax"].toFixed(2);
        gArrayID.push((columnID-1).toString())
        gArrayMortgage.push(+dict["monthlyMortgagePayment"].toFixed(2));
        gArrayMonthlyPropertyTax.push(+dict["monthlyPropertyTax"].toFixed(2));
        gArrayTotalInterest.push(+dict["totalInterest"].toFixed(2));
        //gArray.push(gData2);
        //alert(gArray);



        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawVisualization);
    }

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

function loanPayment(hc, dp, lt, ir, hoa, ptr, pmi, hoi, xp){
    
    var monthlyPropertyTax = ((ptr/100)*hc)/12;
    var downPaymentAmount = (dp/100)*hc;
    var P = hc - downPaymentAmount;
    var i = ir/100/12;
    var n = lt*12;
    var M = P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
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
    var totalPropertyTax = monthlyPropertyTax*n;
    var totalHOI = hoi*n;
    var totalHOA = hoa*n;

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
    var totalCost = hc + totalInterest + totalPMI + totalHOI + totalHOA + totalPropertyTax;

    var dict = {};
    dict["downPaymentAmount"] = downPaymentAmount;
    dict["loanAmount"] = P;
    dict["monthlyMortgagePayment"] = M;
    dict["monthlyPropertyTax"] = monthlyPropertyTax;
    dict["monthlyPMI"] = monthlyPMI;
    dict["totalMonthlyPayment"] = totalMonthlyPayment;
    dict["equity"] = equity;
    dict["totalPMI"] = totalPMI;
    dict["totalCost"] = totalCost;
    dict["totalInterest"] = totalInterest;

    //Extra Monthly Payment
    var mdcount = 0;
    if (xp > 0){
        var newP = P;
        var interestPayment = 0;
        var totalInterest = 0;
        var newPMI = 0;
        var principalPayment = 0;
        var totalPMI = 0;
        var equity = 0;
        var mdcount = 0;
        var M = xp + P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);

        for (var j = 0; j < n; j++){
            mdcount = mdcount + 1;
            interestPayment = newP*i;
            totalInterest = totalInterest + interestPayment;
            principalPayment = M - interestPayment;
            newP = newP - principalPayment;
            if (newP/hc > .8){
                totalPMI = totalPMI + monthlyPMI;
                equity = equity + 1;
            }
            if (newP < 1){
                break;
            }
        }
        var totalPropertyTax = monthlyPropertyTax*mdcount;
        var totalHOI = hoi*mdcount;
        var totalHOA = hoa*mdcount;
        dict["totalInterest2"] = totalInterest;
        var totalCost2 = hc + totalInterest + totalPMI + totalHOI + totalHOA + totalPropertyTax;
        dict["totalSavings"] = totalCost - totalCost2;
    } else {
        dict["totalInterest2"] = 0;
        var totalCost2 = 0;
        dict["totalSavings"] = 0;
    }

    dict["mdcount"] = mdcount;
    dict["totalCost2"] = totalCost2;

    return dict;
}
