//Testing

/*$(document).ready(function() {
    $("tr").not(':first').hover(
    function() {
        //alert('h');
        $(this).addClass('highlight');
    }, function() {
        $(this).removeClass('highlight');
    }
    )
});

$("th").not(':first').hover(
  function () {
          //alert('g');
    $(this).css("background","yellow");
  },
  function () {
    $(this).css("background","");
  }
);*/

/*$(function () { 
    $("td").click(function () { 
        var OriginalContent = $(this).text(); 
        $(this).addClass("cellEditing"); 
        $(this).html("<input type='text' value='" + OriginalContent + "' />"); 
        $(this).children().first().focus(); 
        $(this).children().first().keypress(function (e) { 
            if (e.which == 13) { 
                var newContent = $(this).val(); 
                $(this).parent().text(newContent); 
                $(this).parent().removeClass("cellEditing"); } }); 
                $(this).children().first().blur(function(){ $(this).parent().text(OriginalContent); $(this).parent().removeClass("cellEditing"); }); }); });*/

//Arrow Function Example
/*var arr = 5;
var squares = (x, y) => x*y;
alert(squares(arr, arr));*/
$(".dropdown-toggle").click(function(){
    //alert($(this).text());
});

$(".dropdown-menu li a").first().focusin(function(){
    
});

$('.dropdown-menu').on('focusin', function(){
    //alert('h')
    /*console.log("Saving value " + $(this).val());
    $(this).data('val', $(this).val());*/
});


$('.has-clear input[type="text"]').on('input propertychange', function() {
  var $this = $(this);
  var visible = Boolean($this.val());
  //$this.siblings('.form-control-clear').toggleClass('hidden', !visible);
  alert($this.siblings('.form-control-clear').attr('id'))
  $this.siblings('.form-control-clear').addClass('hidden');
}).trigger('propertychange');

$(".table").on('click', 'tbody tr td div div span', function (e){
    //alert('deleted')
    //e.stopPropagation();
    //var tempValue = numberRound($(t).val(), 2).toFixed(2);
    var oldValue = $(this).siblings('input[type="text"]').attr('data-old-value');
    var newValue = addCommas(oldValue);
    var $td = $(this).parents('td')
    $(this).siblings('input[type="text"]').val(oldValue)
    $(this).siblings('input[type="text"]').siblings('.form-control-clear').addClass('hidden')
    $td.empty()
    $td.text("$" + newValue)
    $td.removeClass('editting')
    .trigger('propertychange').focus();
    
});

/*$('.form-control-clear').click(function(){
    alert('j');
});*/

$(".table").on('focus', 'tr td div div input', function (e){
    //e.stopPropagation();
        //alert('g')
    this.select();
});

/*$(".table > tr > td > div > div > span").click(function (e){
    e.stopPropagation();
    $(this).siblings('input[type="text"]').val('')
    .trigger('propertychange').focus();
});*/


/*$('.form-control-clear').click(function(e) {
    e.stopPropagation();
    alert('g')
    //alert($(this).attr('id'));
  $(this).siblings('input[type="text"]').val('')
    .trigger('propertychange').focus();
});

$('div span').click(function(e) {
    e.stopPropagation();
    alert('g')
    //alert($(this).attr('id'));
  $(this).siblings('input[type="text"]').val('')
    .trigger('propertychange').focus();
});*/


$(document).on('click', '.dropdown-menu li a', function (e) {
  var sel = $(this).prevAll('.dropdown-menu li a:first'),
      val = sel.val(),
      text = sel.find(':selected').text();    
      //alert(text);
});



$(function () { 
    var oldLoanTerm;
    $(".dropdown-toggle").click(function(){
        oldLoanTerm = $(this).text().trim();
    })
    $(".dropdown-menu li a").click(function(){
        var newLoanTerm = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(newLoanTerm+' <span class="caret"></span>');
        if (newLoanTerm != oldLoanTerm) {
            //Recalculate Loan Details
            recalculate(this, newLoanTerm);
        } else {
            //do nothing
        }
    })
});

function recalculate (t, newLoanTerm) {
    var $td = $(t).closest('td');
    //var $td = $(t).find('td');
    //alert($td.attr('id'))
    //alert($(t).index())
    if (newLoanTerm == null) {
        newLoanTerm = $('#-loan-term').find('td').eq($td.index() - 1).find('.dropdown-toggle').text().replace(" years","").trim();
    }
    var $tdID = $td.attr('id');
    var $tr = $td.closest('tr');
    var $trID = $tr.attr('id');
    var newDict = grab($td, $trID, t);
    var loanDict ={};
    loanDict = loanPayment2(newDict["-home-cost"], newDict["-down-payment-dollars"], newLoanTerm.replace(" years","").trim(), newDict["-interest-rate"], newDict["-hoa"], newDict["-property-tax-rate"], newDict["-pmi"], newDict["-hoi"], newDict["-extra-payment"]);
    for (var key in loanDict) {
        $item = $('#' + key).find('td').eq($td.index() - 1);
        var $tr = $item.closest('tr');
        $itemOldValue = removeCommas($item.text());
        if (loanDict[key] != $itemOldValue){
            if ($.inArray(key, detailsArray2) == -1) {
                $item.text("$" + addCommas(loanDict[key]));
            } else {
                $item.text(loanDict[key]);
            }
            $item.stop(true);
            $item.css("background-color", "yellow");
            if ($tr.index() % 2 == 0) {
                $item.animate({backgroundColor: "#F9F9F9"}, 1000);
            } else {
                $item.animate({backgroundColor: "#ADD8E6"}, 1000);
            }
        }
    }
}

//function loanPayment(hc, dp, lt, ir, hoa, ptr, pmi, hoi, xp)
function grab($td, $trID, t) {
    var newDict = {};
    for(var i = 0; i < dollarsArray.length; i++){
        if (dollarsArray[i] == $trID) {
            newDict[dollarsArray[i]] = $(t).val();
        } else {
            newDict[dollarsArray[i]] = removeCommas($('#' + dollarsArray[i]).find('td').eq($td.index() - 1).text());
        }
    }
    for(var i = 0; i < percentArray.length; i++){
        if (percentArray[i] == $trID) {
            newDict[percentArray[i]] = $(t).val();
        } else {
            newDict[percentArray[i]] = removeCommas($('#' + percentArray[i]).find('td').eq($td.index() - 1).text());
        }
    }
    return newDict;
}

function emptyTest(e){
    if (e == null) {
        alert("undefined");
    } else {
        alert("defined");
    }
}

var dollarsArray = ["-home-cost", "-down-payment-dollars", "-hoi", "-hoa" ,"-extra-payment"];
var placeholderDict = {};
placeholderDict["-home-cost"] = "Home Cost";
placeholderDict["-down-payment-dollars"] = "Down Payment";
placeholderDict["-down-payment"] = "Down Payment";
placeholderDict["-property-tax-rate"] = "Property Tax Rate";
placeholderDict["-hoi"] = "Home Owner&#39;s Insurance";
placeholderDict["-pmi"] = "PMI";
placeholderDict["-hoa"] = "HOA";
placeholderDict["-extra-payment"] = "Extra Payment";
placeholderDict["-interest-rate"] = "Interest Rate";
placeholderDict["-square-footage"] = "Square Footage";
var percentArray = ["-down-payment", "-property-tax-rate", "-pmi", "-interest-rate"];
var detailsArray = ["-square-footage"];
var ignoreArray = ["-loan-term", "-delete", "-price-per-square-foot", "-loan-amount", "-monthly-mortgage-payment", "-monthly-property-tax", 
                  "-monthly-pmi", "-total-monthly-payment", "-extra-payment-months", "-extra-payment-total-interest-paid", "-total-interest-savings", 
                  "-pmi-months", "-total-pmi-paid", "-10-year-interest", "-15-year-interest", "-20-year-interest", "-30-year-interest", 
                  "-total-cost", "-extra-payment-total-cost"];
var detailsArray2 = ["-extra-payment-months", "-pmi-months"];

/*$(".table").on('click', 'tr td div div span', function (){
    //alert('g')
});
$(".table").on('click', 'tr td div div input', function (){
    //$(this).popover('hide');
});*/



$("td").click(function (e) {
    //e.stopPropagation();
    var $td = $(this);
    var $tdID = $td.attr('id');
    var $tr = $td.closest('tr');
    var $trID = $tr.attr('id');    
    if ($.inArray($trID, ignoreArray) == -1) {
        var htmlTemp =  '<div class="input-group">' +
                            '<div class="form-group has-feedback has-clear">' +
                                    "<input type='text' class='cell-input form-control'/>" +
                                '<span class="glyphicon form-control-feedback glyphicon-right"></span>' +
                            '</div>' +
                        '</div>';
        var $html = $($.parseHTML(htmlTemp));
        var oldValue = removeCommas($td.text());
        var $sf = $('#-square-footage').find('td').eq($td.index() - 1);
        var $ppsf = $('#-price-per-square-foot').find('td').eq($td.index() - 1);
        if (!$td.hasClass("editting")) {
            $td.addClass("editting");
            var $input = $html.find('input');
            $input.attr('size', oldValue.length).attr('id', $tdID + $trID).attr('placeholder', placeholderDict[$trID]).attr('value', oldValue);
            $td.html($html);
            //$td.html("<input type='text' class='form-control' size='" + oldValue.length + "' id='" + $tdID + $trID + "' placeholder='" + placeholderDict[$trID] + "' value='" + oldValue + "' />"); 
            $td.children().first().focus();
            $("#" + $tdID + $trID).select();
            $(this).children().first().keypress(function (e) {
                if (e.which == 13) {
                    cellEdit(oldValue, this, $td, $tdID, $tr, $trID, $sf, $ppsf);
                }
            });
            $td.children().first().focusout(function () {
                var $existingInput = $td.find('input');
                //alert($existingInput.val())
                var validate = cellValidate($existingInput.get(0));
                //alert(validate);
                if (validate == 1){
                    cellEdit(oldValue, $existingInput, $td, $tdID, $tr, $trID, $sf, $ppsf);
                } else if (validate == 0){
                    var newValue = $(this).find('input').val();
                    var htmlError = '<div id="-home-cost-group" class="form-group has-error required">' +
                                        '<div id="-home-cost-check">' +
                                            '<div class="input-group">' +
                                                "<input type='text' data-old-value='" + oldValue + "' class='cell-input form-control' size='" + oldValue.length + "' id='" + $tdID + $trID + "' placeholder='" + placeholderDict[$trID] + "' value='" + oldValue + "' />" +
                                                '<span id="-home-cost-glyph" class="glyphicon glyphicon-remove form-control-feedback glyphicon-right" aria-hidden="true"></span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>';

                    var htmlError2 = '<div id="-home-cost-group" class="form-group has-feedback has-clear">' +
                                        '<div id="-home-cost-check">' +
                                            '<div class="input-group">' +
                                                "<input type='text' data-old-value='" + oldValue + "' class='cell-input form-control' size='" + oldValue.length + "' id='" + $tdID + $trID + "' placeholder='" + placeholderDict[$trID] + "' value='" + oldValue + "' />" +
                                                '<span id="-home-cost-glyph" class="form-control-clear glyphicon glyphicon-remove form-control-feedback hidden"></span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>';
                    var htmlError3 = '<div class="input-group">' +
                                        '<div class="form-group has-feedback has-clear has-error">' +
                                                "<input type='text' tabindex='0' role='button' data-toggle='popover' data-container='body' data-trigger='focus' title='Dismissible popover' data-content='Please enter a value between $10,000 and $1,000,000,000' data-old-value='" + oldValue + "' class='cell-input form-control' size='" + oldValue.length + "' id='" + $tdID + $trID + "' placeholder='" + placeholderDict[$trID] + "' value='" + newValue + "' />" +
                                            '<span class="form-control-clear glyphicon glyphicon-remove form-control-feedback glyphicon-right"></span>' +
                                        '</div>' +
                                    '</div>';
                    //$td.html("<input type='text' data-old-value='" + oldValue + "' class='form-control' size='" + oldValue.length + "' id='" + $tdID + $trID + "' placeholder='" + placeholderDict[$trID] + "' value='" + oldValue + "' />");
                    $td.html(htmlError3);
                    $html3 = $.parseHTML(htmlError3);
                    var $test = $td.find('input');
                    //alert($('#delme').text())
                    //alert($test.attr('data-toggle'))
                    //$('[data-toggle="popover"]').popover();
                    //$test.popover({'placement':'bottom'}).popover('show');
                    //$("[data-toggle=popover]").popover();
                    $test.popover('toggle');
                } else {
                    //Do Nothing
                    alert('nothing')
                }
            });
        } else {
            /*var $existingInput = $td.find('input');
            var oldValue = $existingInput.attr('data-old-value');
            $(this).children().first().keypress(function (e) {
                if (e.which == 13) {
                    cellEdit(oldValue, $existingInput.get(0), $td, $tdID, $tr, $trID, $sf, $ppsf);
                }
            });
            $td.children().first().focusout(function () {
                var newValue = $existingInput.val();
                var htmlError3 = '<div class="input-group">' +
                                    '<div class="form-group has-feedback has-clear has-error">' +
                                            "<input type='text' data-old-value='" + oldValue + "' class='cell-input form-control' size='" + oldValue.length + "' id='" + $tdID + $trID + "' placeholder='" + placeholderDict[$trID] + "' value='" + newValue + "' />" +
                                        '<span id="del" class="form-control-clear glyphicon glyphicon-remove form-control-feedback glyphicon-right"></span>' +
                                    '</div>' +
                                '</div>';
                var validate = cellValidate($existingInput.get(0));
                if (validate == 1){
                    cellEdit(oldValue, $existingInput, $td, $tdID, $tr, $trID, $sf, $ppsf);
                } else if (validate == 0){
                    $td.html(htmlError3);
                } else {
                    alert('nothing2')
                    //Do Nothing
                }
            });*/
        }
    }
});

$(".table").on('focusout', 'tr td div div input', function (e){
    e.stopPropagation();
    var $existingInput = $(this);
    var $td = $existingInput.closest('td');
    var $tdID = $td.attr('id');
    var $tr = $existingInput.closest('tr');
    var $trID = $tr.attr('id');
    //alert($existingInput);
    //alert($tdID);
    //alert($trID);

    var oldValue = $existingInput.attr('data-old-value');
    //alert(oldValue);

    var newValue = $existingInput.val();
    //alert(newValue);

    var htmlError3 = '<div class="input-group">' +
                        '<div class="form-group has-feedback has-clear has-error">' +
                                "<input type='text' data-old-value='" + oldValue + "' class='cell-input form-control' size='" + oldValue.length + "' id='" + $tdID + $trID + "' placeholder='" + placeholderDict[$trID] + "' value='" + newValue + "' />" +
                            '<span id="del" class="form-control-clear glyphicon glyphicon-remove form-control-feedback glyphicon-right"></span>' +
                        '</div>' +
                    '</div>';
    var validate = cellValidate($existingInput.get(0));
    //alert(validate);
    if (validate == 1){
        var $sf = $('#-square-footage').find('td').eq($td.index() - 1);
        var $ppsf = $('#-price-per-square-foot').find('td').eq($td.index() - 1);
        cellEdit(oldValue, $existingInput, $td, $tdID, $tr, $trID, $sf, $ppsf);
    } else if (validate == 0){
        //$td.html(htmlError3);
    } else {
        alert('nothing2')
        //Do Nothing
    }
});


function cellEdit(oldValue, t, $td, $tdID, $tr, $trID, $sf, $ppsf){
    var newValue = $(t).val();
    //var $temp = $(t).closest('td');
    //alert($temp.attr('id'));
    if ($.inArray($trID, detailsArray) == -1) {
        if (newValue != oldValue) {
            recalculate(t);
        }
    }
    //$(t).parent().removeClass("editting");
    $td.removeClass("editting");
    if (newValue == "" || isNaN(newValue) == true) {
        if ($.inArray($trID, dollarsArray) != -1) {
            $(t).parent().text(addCommas("$" + oldValue));
        } else if ($.inArray($trID, percentArray) != -1) {
            $(t).parent().text(addCommas(oldValue + "%"));
        } else if ($.inArray($trID, detailsArray) != -1) {
            $(t).parent().text(addCommas(oldValue));
        }
    } else {
        if ($.inArray($trID, dollarsArray) != -1) {
            //var tempValue = Number($(t).val()).toFixed(2);
            var tempValue = numberRound(newValue, 2).toFixed(2);
            //alert(tempValue);
            var newCellText = addCommas(tempValue);
            $td.empty();
            $td.text("$" + newCellText);
            //$(t).parent().empty();
            //$(t).parent().text("$" + newValue);
            if ($trID == "-home-cost"){
                var price = (tempValue/parseInt($sf.text().replace(",",""))).toFixed(2);
                if ($ppsf.text().replace("$","") != price) {
                    $ppsf.text("$" + addCommas(price));
                    $ppsf.css("background-color", "yellow");
                    var $ppsftr = $ppsf.closest('tr');
                    $ppsftr.stop(true);
                    if ($ppsftr.index() % 2 == 0) {
                        $ppsf.animate({backgroundColor: "#F9F9F9"}, 1000);
                    } else {
                        $ppsf.animate({backgroundColor: "#ADD8E6"}, 1000);
                    }
                }
            }
        } else if ($.inArray($trID, percentArray) != -1) {
            var tempValue = Number(newValue).toFixed(3);
            var newCellText = addCommas(tempValue);
            $td.empty();
            $td.text(newCellText + "%");
        } else if ($.inArray($trID, detailsArray) != -1) {
            var tempValue = Number(newValue).toFixed(0);
            var newCellText = addCommas(tempValue);
            $td.empty();
            $td.text(newCellText);
            if ($trID == "-square-footage"){
                var $hc = removeCommas($('#-home-cost').find('td').eq($td.index() - 1).text());
                var price = ($hc/tempValue).toFixed(2);
                if ($ppsf.text().replace("$","") != price) {
                    $ppsf.text("$" + addCommas(price));
                    $ppsf.css("background-color", "yellow");
                    var $ppsftr = $ppsf.closest('tr');
                    $ppsftr.stop(true);
                    if ($ppsftr.index() % 2 == 0) {
                        $ppsf.animate({backgroundColor: "#F9F9F9"}, 1000);
                    } else {
                        $ppsf.animate({backgroundColor: "#ADD8E6"}, 1000);
                    }
                }
            }
        }
    }
}

//Monetary Amounts
$("td").keypress(function (e) {
    var $input = $(this).closest('td').find("input");
    var $tr = $(this).closest('tr');
    var $trID = $tr.attr('id');
    var charCode = e.keyCode;
    var number = $input.val().split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if(number.length > 1 && charCode == 46){
        return false;
    }
    var caratPos = getSelectionStart($input.get(0));
    var dotPos = $input.val().indexOf(".");

    if ($.inArray($trID, dollarsArray) != -1) {
        if( caratPos > dotPos && dotPos > -1 && (number[1].length > 1)) {
            return false;
        }
        return true;
    } else if ($.inArray($trID, percentArray) != -1) {
        if( caratPos > dotPos && dotPos > -1 && (number[1].length > 2)) {
            return false;
        }
        return true;
    }
    function getSelectionStart(o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate()
            r.moveEnd('character', o.value.length)
            if (r.text == '') return o.value.length
            return o.value.lastIndexOf(r.text)
        } else return o.selectionStart
    }
});

function numberRound(number, decimals) {
    tempNumber = parseFloat(number);
    roundedNumber = (Number(number) + 1 / Math.pow(10, Number(decimals) + 1)).toFixed(decimals)
    newNumber = parseFloat(roundedNumber);
    return newNumber;
}

function loanPayment2(hc, dpd, lt, ir, hoa, ptr, pmi, hoi, xp){
    hc = numberRound(hc, 2);
    dpd = numberRound(dpd, 2);
    lt = parseInt(lt);
    ir = numberRound(ir, 3);
    hoa = numberRound(hoa, 2);
    ptr = numberRound(ptr, 3);
    pmi = numberRound(pmi, 3);
    hoi = numberRound(hoi, 2);
    xp = numberRound(xp, 2);

    //alert(hc + "," + dpd + "," + lt + "," + ir + "," + hoa + "," + ptr + "," + pmi + "," + hoi + "," + xp)

    var monthlyPropertyTax = ((ptr/100)*hc)/12;
    var downPaymentAmount = dpd;
    var dp = (downPaymentAmount/hc)*100;
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
    //dict["downPaymentAmount"] = downPaymentAmount;
    dict["-loan-amount"] = numberRound(P, 2);
    dict["-monthly-mortgage-payment"] = numberRound(M, 2);
    dict["-monthly-property-tax"] = numberRound(monthlyPropertyTax, 2);
    dict["-monthly-pmi"] = numberRound(monthlyPMI, 2);
    dict["-total-monthly-payment"] = numberRound(totalMonthlyPayment, 2);
    dict["-pmi-months"] = equity;
    dict["-total-pmi-paid"] = numberRound(totalPMI, 2);
    dict["-total-cost"] = numberRound(totalCost, 2);
    dict["-total-interest-paid"] = numberRound(totalInterest, 2);

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
        dict["-extra-payment-total-interest-paid"] = numberRound(totalInterest, 2);
        var totalCost2 = hc + totalInterest + totalPMI + totalHOI + totalHOA + totalPropertyTax;
        dict["-total-interest-savings"] = numberRound(totalCost - totalCost2, 2);
    } else {
        dict["-extra-payment-total-interest-paid"] = 0;
        var totalCost2 = 0;
        dict["-total-interest-savings"] = 0;
    }

    dict["-extra-payment-months"] = mdcount;
    dict["-extra-payment-total-cost"] = numberRound(totalCost2, 2);

    return dict;
}

function cellWrongText(x, y, z){
    //$("#"+x+"-help-block").show();
    if (x.match(/down-payment.*/)){
        $("#"+x+"-check").attr('class', 'has-error');
    } else if(x.match(/interest-rate-.*/)){
        $("#"+x+"-check").attr('class', 'has-error');
    } else {
        $("#"+x+"-group").attr('class', 'form-group form-group-md nopadding has-error '+y);
    }
    $("#"+x+"-glyph").attr('class', 'glyphicon glyphicon-remove form-control-feedback glyphicon-'+z);
    return;
}

function cellValidate(t) {
    //alert($(t).val())
    //var $input = $(t).closest('td').find("input");
    //alert($input)
    var $input = $(t);
    
    if ($input.length == 0) {
        return 2;
    }
    
    var $td = $(t).closest('td');
    var $tdID = $td.attr('id');
    var $tr = $(t).closest('tr');
    var $trID = $tr.attr('id');
    
    //alert($input.val());
    var x = removeCommas($input.val());
    //alert(x);

    var $homeCost = removeCommas($('#-home-cost').find('td').eq($td.index() - 1).text());
    var $downPaymentDollars = removeCommas($('#-down-payment-dollars').find('td').eq($td.index() - 1).text());
    var $downPayment = removeCommas($('#-down-payment').find('td').eq($td.index() - 1).text());
    var $loanTerm = $('#-loan-term').find('td').eq($td.index() - 1).find('.dropdown-toggle').text().replace(" years","").trim();
    var $interestRate = removeCommas($('#-interest-rate').find('td').eq($td.index() - 1).text());
    var $hoa = removeCommas($('#-hoa').find('td').eq($td.index() - 1).text());
    var $propertyTaxRate = removeCommas($('#-property-tax-rate').find('td').eq($td.index() - 1).text());
    var $pmi = removeCommas($('#-pmi').find('td').eq($td.index() - 1).text());
    var $hoi = removeCommas($('#-hoi').find('td').eq($td.index() - 1).text());
    var $extraPayment = removeCommas($('#-extra-payment').find('td').eq($td.index() - 1).text());
    if ($input.attr('id').match(/-home-cost*/)){
        var $homeCost = removeCommas($input.val());
    } else if ($input.attr('id').match(/-down-payment-dollars*/)){
        var $downPaymentDollars = removeCommas($input.val());
    } else if ($input.attr('id').match(/-down-payment*/)){
        var $downPayment = removeCommas($input.val());
    } else if ($input.attr('id').match(/-loan-term*/)){
        var $loanTerm = removeCommas($input.val());
    } else if ($input.attr('id').match(/-interest-rate*/)){
        var $interestRate = removeCommas($input.val());
    } else if ($input.attr('id').match(/-hoa*/)){
        var $hoa = removeCommas($input.val());
    } else if ($input.attr('id').match(/-property-tax-rate*/)){
        var $propertyTaxRate = removeCommas($input.val());
    } else if ($input.attr('id').match(/-pmi*/)){
        var $pmi = removeCommas($input.val());
    } else if ($input.attr('id').match(/-hoi*/)){
        var $hoi = removeCommas($input.val());
    } else if ($input.attr('id').match(/-extra-payment*/)){
        var $extraPayment = removeCommas($input.val());
    }

    var validate = 1;
    switch($trID){
        case "-home-cost":
            if (x.length == 0){
                validate = 0;
                textRequired($trID, "required", "right");
            } else {
                if (x < 10000 || +x > 1000000000){
                    validate = 0;
                    cellWrongText($trID, "required", "right");
                } else {
                    if ($downPaymentDollars.length > 0 && $downPayment.length == 0){
                        $('#-down-payment').val(((+$downPaymentDollars/+x)*100).toFixed(3));
                        correctText("-down-payment", "required", "left");
                        $("#down-payment-label").css("color", "#3c763d");
                    } else if ($downPayment.length > 0){
                        $('#-down-payment-dollars').val(addCommas(+$downPayment*+x));
                        correctText("-down-payment-dollars", "required", "right");
                        $("#-down-payment-label").css("color", "#3c763d");
                        correctText("-down-payment", "required", "left");
                    }
                    correctText($trID, "required", "right");
                }
            }
            break;
        case "-down-payment-dollars":
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
                    validate = 0;
                    correctText($trID, "required", "right");
                    if ($downPayment.length == 0){
                        //$('#down-payment').val("0.000");
                    } else {
                        correctText("down-payment", "required", "left");
                    }
                    $("#down-payment-label").css("color", "#3c763d");
                } else {
                    if (+x >= +$homeCost){
                        validate = 0;
                        wrongText($trID, "required", "right");
                        wrongText("down-payment", "required", "left");
                        $("#down-payment-label").css("color", "#a94442");
                    } else {
                        correctText($trID, "required", "right");
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
                    wrongText($trID, "required", "left");
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
                    correctText($trID, "required", "left");
                    correctText("down-payment-dollars", "required", "right");
                    $("#down-payment-label").css("color", "#3c763d");
                }
            }
            break;
        case "hoa":
            if (x.length == 0){
                textNotRequired($trID, "", "center");
            } else {
                if (+$hoa > 1000 ){
                    validate = 0;
                    wrongText($trID, "", "center");
                } else {
                    correctText($trID, "", "center");
                }
            }
            break;
        case "property-tax-rate":
            if (x.length == 0){
                textRequired($trID, "required", "left");
            } else {
                if (+$propertyTaxRate > 10 ){
                    validate = 0;
                    wrongText($trID, "required", "left");
                } else {
                    correctText($trID, "required", "left");
                }
            }
            break;
        case "pmi":
            if (x.length == 0){
                if ($downPayment.length > 0){
                    if (+$downPayment >= 20){
                        textNotRequired($trID, "", "left");
                    } else {
                        textRequired($trID, "required", "left");
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
                            wrongText($trID, "required", "left");
                        } else {
                            correctText($trID, "required", "left");
                        }
                    }
                } else {
                    textNotRequired($trID, "", "left");
                }
            }
            break;
        case "hoi":
            if (x.length == 0){
                textRequired($trID, "required", "center");
            } else {
                if (+$hoi > 1000 ){
                    validate = 0;
                    wrongText($trID, "required", "center");
                } else {
                    correctText($trID, "required", "center");
                }
            }
            break;
        case "extra-payment":
            if (x.length == 0){
                textNotRequired($trID, "", "center");
            } else {
                if (+$extraPayment > 5000){
                    validate = 0;
                    wrongText($trID, "", "center");
                } else {
                    correctText($trID, "", "center");
                }
            }
            break;
    }
    return(validate);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Google Charts Global Variables
var gData2 = {};
var gArrayID = ["Loan"];
var gArrayMortgage = ["Mortgage"];
var gArrayMonthlyPropertyTax = ["Property Tax"];
var gArrayTotalInterest = ["Total Interest"];


var columnID = 0;
var textArray = ["Home Details", "Home Cost", "Square Footage", "Price per Square Foot", "Property Tax Rate", 
                 "Loan Details", "Loan Term", "Interest Rate", "Down Payment", "Loan Amount", 
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
    } else if (x == 0 || x == 5 || x == 10 || x == 17 || x == 22 || x == 25 || x == 30) {
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
        } else if (x == 0 || x == 5 || x == 10 || x == 17 || x == 22 || x == 25 || x == 30) {
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
    
    if( caratPos > dotPos && dotPos > -1 && (number[1].length > 1)) {
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
    var number = $(this).val().split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if(number.length > 1 && charCode == 46){
        return false;
    }
    var caratPos = getSelectionStart(this);
    var dotPos = $(this).val().indexOf(".");
    
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
    return x.toString().replace(/,/g,"").replace("$","").replace("%","");
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
        var costFoot = Number(Math.round($homeCost/2900+'e2')+'e-2');
        var ptrString = Number(Math.round($propertyTaxRate+'e3')+'e-3').toFixed(3)+"%";
        var istring =  Number(Math.round($interestRate+'e3')+'e-3').toFixed(3)+"%";
        var dataArray = ["Home Details", $homeCost, 2900, costFoot, ptrString,
                         "Loan Details", $loanTerm, istring, dict["downPaymentAmount"], dict["loanAmount"],
                         "Monthly Payment Breakdown", dict["monthlyMortgagePayment"], dict["monthlyPropertyTax"], $hoi, dict["monthlyPMI"], $hoa, dict["totalMonthlyPayment"],
                         "Early Mortgage Payoff", $extraPayment, dict["mdcount"], dict["totalInterest2"], dict["totalSavings"],
                         "PMI Details", dict["equity"], dict["totalPMI"],
                         "Total Interest Paid", tempArray[0], tempArray[1], tempArray[2], tempArray[3],
                         "Total Out Of Pocket Cost Over Life of Loan", dict["totalCost"], dict["totalCost2"]];
        for (var y = 0; y < dataArray.length; y++){
            if (y != 0 && y != 5 && y != 10 && y != 17 && y != 22 && y != 25 && y != 30){
                var column = document.createElement("td");
                column.id = columnID;
                if (y == 2){
                    var text = document.createTextNode(addCommas(dataArray[y]));
                } else if (y == 6){
                    var text = document.createTextNode(dataArray[y]+" years");
                } else if (y == 4 || y == 7 || y == 19 || y == 23){
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