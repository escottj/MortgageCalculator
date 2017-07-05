//Validation (Angular Approach)
/*
$untouched The field has not been touched yet
$touched The field has been touched
$pristine The field has not been modified yet
$dirty The field has been modified
$invalid The field content is not valid
$valid The field content is valid
*/
//Initital State of Input Field
var inputStatus = "untouched";

//Inputs: input id, required/not required, min value, max value, dependents' id)
function inputCheck($input, min, max, $dependent, dependentType) {
    $inputValue = $input.val();
    $dependentValue = parseFloat(removeCommas($dependent.val()));
    //alert($dependentValue)
    if ($inputValue >= min && $inputValue <= max) {
        if (dependentType == "min") {
            if ($inputValue >= $dependentValue) {
                //alert('good value!')
            } else {
                //alert('bad value!')
            }
        }
    }
}

//Test function
$("input").on('focusout', function (e) {
    e.stopPropagation();
    var $input = $(this);
    if ($input.attr('id') == "home-cost") {
        var validate = inputCheck($input, 10000.00, 1000000000.00, $("#down-payment-dollars"), "min");
    }
});

$(".table").on('click', 'tbody tr td div div span', function (e) {
    //e.stopPropagation();
    const $this = $(this);
    const $oldValue = $this.siblings('input[type="text"]').attr('data-old-value');
    const $newValue = addCommas($oldValue);
    const $td = $this.parents('td')
    $this.siblings('input[type="text"]').val($oldValue)
    $this.siblings('input[type="text"]').popover('hide');
    $this.siblings('input[type="text"]').siblings('.form-control-clear').addClass('hidden')
    const $tr = $this.closest('tr');
    const $trID = $tr.attr('id');
    $td.empty();
    if ($.inArray($trID, dollarsArray) !== -1) {
        $td.text('$' + $newValue);
    } else if ($.inArray($trID, percentArray) !== -1) {
        $td.text($newValue + '%');
    } else if ($.inArray($trID, detailsArray) !== -1) {
        $td.text($newValue);
    }     
    $td.removeClass('editting')
});

$(".table").on('focus', 'tr td div div input', function (e) {
    //e.stopPropagation();
    const $input = $(this);
    $input.select();
    //$input.popover('hide');
});

$(document).on('click', '.dropdown-menu li a', function (e) {
    const $this = $(this);
    const sel = $this.prevAll('.dropdown-menu li a:first');
    const val = sel.val();
    const text = sel.find(':selected').text();
});

$(function () {
    let $this;
    let $oldLoanTerm;
    $(".dropdown-toggle").click(function() {
        $this = $(this);
        $oldLoanTerm = $this.text().trim();
    })
    $(".dropdown-menu li a").click(function() {
        $this = $(this);
        const $newLoanTerm = $this.text();
        $this.parents('.btn-group').find('.dropdown-toggle').html($newLoanTerm+' <span class="caret"></span>');
        if ($newLoanTerm != $oldLoanTerm) {
            //Recalculate Loan Details
            recalculate($this, $newLoanTerm);
        } else {
            //do nothing
        }
    })
});

function recalculate ($this, $newLoanTerm) {
    const $td = $this.closest('td');
    const $tdIndex = $td.index();
    if ($newLoanTerm == null) {
        $newLoanTerm = $('#-loan-term').find('td').eq($tdIndex - 1).find('.dropdown-toggle').text().replace(" years","").trim();
    }
    let $tr = $td.closest('tr');
    const $trID = $tr.attr('id');
    let newDict = grab($td, $trID, $this);
    let loanDict = {};
    loanDict = loanPayment2(newDict, $newLoanTerm.replace(" years","").trim());
    for (let key in loanDict) {
        $item = $('#' + key).find('td').eq($tdIndex - 1);
        $tr = $item.closest('tr');
        $itemOldValue = removeCommas($item.text());
        if (loanDict[key] != $itemOldValue) {
            if ($.inArray(key, detailsArray2) === -1) {
                cellAnimate($item, loanDict[key], $itemOldValue, '$');
            } else {
                $item.text(loanDict[key]);
            }
        }
    }
}

function grab($td, $trID, $this) {
    const $tdIndex = $td.index();
    let newDict = {};
    for(let i = 0; i < dollarsArray.length; i++) {
        if (dollarsArray[i] === $trID) {
            newDict[dollarsArray[i]] = $this.val();
        } else {
            newDict[dollarsArray[i]] = numberRound(removeCommas($('#' + dollarsArray[i]).find('td').eq($tdIndex - 1).text()), 2);
        }
    }
    for(let i = 0; i < percentArray.length; i++) {
        if (percentArray[i] === $trID) {
            newDict[percentArray[i]] = $this.val();
        } else {
            newDict[percentArray[i]] = numberRound(removeCommas($('#' + percentArray[i]).find('td').eq($tdIndex - 1).text()), 3);
        }
    }
    return newDict;
}

const dollarsArray = ['-home-cost', '-down-payment-dollars', '-hoi', '-hoa', '-extra-payment'];
const placeholderDict = {};
placeholderDict['-home-cost'] = 'Home Cost';
placeholderDict['-down-payment-dollars'] = 'Down Payment';
placeholderDict['-down-payment'] = 'Down Payment';
placeholderDict['-property-tax-rate'] = 'Property Tax Rate';
placeholderDict['-hoi'] = 'Home Owner&#39;s Insurance';
placeholderDict['-pmi'] = 'PMI';
placeholderDict['-hoa'] = 'HOA';
placeholderDict['-extra-payment'] = 'Extra Payment';
placeholderDict['-interest-rate'] = 'Interest Rate';
placeholderDict['-square-footage'] = 'Square Footage';
const percentArray = ['-down-payment', '-property-tax-rate', '-pmi', '-interest-rate'];
const detailsArray = ['-square-footage'];
const ignoreArray = ['-loan-term', '-delete', '-price-per-square-foot', '-loan-amount', '-monthly-mortgage-payment', '-monthly-property-tax', 
                     '-monthly-pmi', '-total-monthly-payment', '-extra-payment-months', '-extra-payment-total-interest-paid', '-total-interest-savings', 
                     '-pmi-months', '-total-pmi-paid', '-10-year-interest', '-15-year-interest', '-20-year-interest', '-30-year-interest', 
                     '-total-cost', '-extra-payment-total-cost'];
const detailsArray2 = ['-extra-payment-months', '-pmi-months'];

$("td").click(function (e) {
    //e.stopPropagation();
    const $td = $(this);
    const $tdIndex = $td.index();
    const $tr = $td.closest('tr');
    const $trID = $tr.attr('id');    
    if ($.inArray($trID, ignoreArray) == -1) {
        const htmlTemp =  '<div class="input-group">' +
                            '<div class="form-group has-feedback has-clear">' +
                                "<input type='text' tabindex='0' role='button' data-toggle='popover' data-container='body' class='cell-input form-control'/>" +
                                '<span class="form-control-clear glyphicon form-control-feedback glyphicon-right"></span>' +
                            '</div>' +
                        '</div>';
        const $html = $($.parseHTML(htmlTemp));
        const oldValue = removeCommas($td.text());      
        const $sf = $('#-square-footage').find('td').eq($td.index() - 1);
        const $ppsf = $('#-price-per-square-foot').find('td').eq($td.index() - 1);
        if (!$td.hasClass("editting")) {
            $td.addClass("editting");
            let $input = $html.find('input');
            $input.attr('size', oldValue.length);
            $input.attr('id', $tdIndex + $trID);
            $input.attr('placeholder', placeholderDict[$trID]);
            $input.attr('value', oldValue);
            $input.attr('data-old-value', oldValue);
            $td.html($html);
            $td.children().first().focus();
            $("#" + $tdIndex + $trID).select();
            $(this).children().first().keypress(function (e) {
                if (e.which == 13) {
                    cellEdit(oldValue, this, $td, $tdIndex, $tr, $trID, $sf, $ppsf);
                }
            });
            $td.children().first().focusout(function () {
                $input = $td.find('input');
                const cellInfo = cellValidate($input);
                const validate = cellInfo[0];
                const errorText = cellInfo[1];
                if (validate == 1) {
                    cellEdit(oldValue, $input, $td, $tdIndex, $tr, $trID, $sf, $ppsf);
                } else if (validate == 0) {
                    const $newValue = $input.val();
                    $input.attr('size', oldValue.length);
                    $input.attr('id', $tdIndex + $trID);
                    $input.attr('placeholder', placeholderDict[$trID]);
                    $input.attr('value', oldValue);
                    $input.attr('data-old-value', oldValue);
                    $input.attr('data-content', errorText);
                    $input.val($newValue);
                    const $formGroup = $input.closest('.form-group');
                    $formGroup.addClass('has-error');
                    const $glyphicon = $formGroup.children('.glyphicon');
                    $glyphicon.addClass('glyphicon-remove');
                    $input.popover('show');
                } else {
                    //Do Nothing
                    alert('nothing')
                }
            });
        }
    }
});

$(".table").on('focusout', 'tr td div div input', function (e) {
    e.stopPropagation();
    const $input = $(this);
    const $td = $input.closest('td');
    const $tdID = $td.attr('id');
    const $tr = $input.closest('tr');
    const $trID = $tr.attr('id');
    const $oldValue = $input.attr('data-old-value');
    const $newValue = $input.val();
    const htmlError3 = '<div class="input-group">' +
                        '<div class="form-group has-feedback has-clear has-error">' +
                                "<input type='text' data-old-value='" + $oldValue + "' class='cell-input form-control' size='" + $oldValue.length + "' id='" + $tdID + $trID + "' placeholder='" + placeholderDict[$trID] + "' value='" + $newValue + "' />" +
                            '<span id="del" class="form-control-clear glyphicon glyphicon-remove form-control-feedback glyphicon-right"></span>' +
                        '</div>' +
                    '</div>';
    const cellInfo = cellValidate($input);
    const validate = cellInfo[0];
    if (validate == 1) {
        $input.popover('hide');
        const $sf = $('#-square-footage').find('td').eq($td.index() - 1);
        const $ppsf = $('#-price-per-square-foot').find('td').eq($td.index() - 1);
        cellEdit($oldValue, $input, $td, $tdID, $tr, $trID, $sf, $ppsf);
    } else if (validate == 0) {
        $input.popover('show');
    } else {
        //Do Nothing
        alert('nothing')
    }
});

function cellAnimate($cell, $newValue, $oldValue, symbol) {
    if ($newValue !== $oldValue) {
        if (symbol === '$') {
            $cell.text('$' + addCommas($newValue));
        } else if (symbol === '%') {
            $cell.text(addCommas($newValue) + '%');
        } else if (symbol === '') {
            $cell.text(addCommas($newValue));
        }
        $cell.css('background-color', 'yellow');
        $cell.stop(true);
        const $cellTR = $cell.closest('tr');
        if ($cellTR.index() % 2 === 0) {
            $cell.animate({backgroundColor: '#F9F9F9'}, 1000);
        } else {
            $cell.animate({backgroundColor: '#ADD8E6'}, 1000);
        }
    } else {
        $cell.empty();
        if (symbol === '$') {
            $cell.text('$' + addCommas($newValue));
        } else if (symbol === '%') {
            $cell.text(addCommas($newValue) + '%');
        } else if (symbol === '') {
            $cell.text(addCommas($newValue));
        }
    }
}

function cellEdit($oldValue, $this, $td, $tdIndex, $tr, $trID, $sf, $ppsf){
    let tempValue;
    let newCellText;
    let $newValue;
    if ($.inArray($trID, dollarsArray) !== -1) {
        $newValue = numberRound($this.val(), 2);
    } else if ($.inArray($trID, percentArray) !== -1) {
        $newValue = numberRound($this.val(), 3);
    } else if ($.inArray($trID, detailsArray) !== -1) {
        $newValue = numberRound($this.val(), 0);
    }     
    if ($this.val() === '' || isNaN($newValue) === true || $newValue === $oldValue) {
        $td.empty();
        if ($.inArray($trID, dollarsArray) !== -1) {
            $td.text(addCommas('$' + $oldValue));
        } else if ($.inArray($trID, percentArray) !== -1) {
            $td.text(addCommas($oldValue + '%'));
        } else if ($.inArray($trID, detailsArray) !== -1) {
            $td.text(addCommas($oldValue));
        }
    } else {
        if ($newValue !== $oldValue) {
            const $homeCost = $('#-home-cost').find('td').eq($tdIndex - 1);
            const $homeCostValue = numberRound(removeCommas($homeCost.text()), 2);
            const $downPaymentDollars = $('#-down-payment-dollars').find('td').eq($tdIndex - 1);
            const $downPaymentDollarsValue = numberRound(removeCommas($downPaymentDollars.text()), 2);
            const $downPayment = $('#-down-payment').find('td').eq($tdIndex - 1);
            const $downPaymentValue = numberRound(removeCommas($downPayment.text()), 3);
            const $sfValue = numberRound(removeCommas($sf.text()), 0);
            const $ppsfValue = numberRound(removeCommas($ppsf.text()), 2);
            let symbol;
            if ($.inArray($trID, dollarsArray) !== -1) {
                symbol = '$';
                if ($trID === '-home-cost') {
                    const $newDownPaymentDollarsValue = numberRound($newValue * ($downPaymentValue/100), 2);
                    cellAnimate($downPaymentDollars, $newDownPaymentDollarsValue, $downPaymentDollarsValue, '$');
                    const $newppsfValue = numberRound($newValue/$sfValue, 2);
                    cellAnimate($ppsf, $newppsfValue, $ppsfValue, '$');
                } else if ($trID === '-down-payment-dollars') {
                    const $newDownPaymentValue = numberRound(($newValue/$homeCostValue)*100, 3);
                    cellAnimate($downPayment, $newDownPaymentValue, $downPaymentValue, '%');
                }
            } else if ($.inArray($trID, percentArray) !== -1) {
                symbol = '%';
                if ($trID === '-down-payment') {
                    const $newDownPaymentDollarsValue = numberRound($homeCostValue * ($newValue/100), 2);
                    cellAnimate($downPaymentDollars, $newDownPaymentDollarsValue, $downPaymentDollarsValue, '$');
                }
            } else if ($.inArray($trID, detailsArray) !== -1) {
                symbol = '';
                if ($trID === '-square-footage') {
                    const $newppsfValue = numberRound($homeCostValue/$newValue, 2);
                    cellAnimate($ppsf, $newppsfValue, $ppsfValue, '$');
                }
            }
            recalculate($this);
            cellAnimate($td, $newValue, $oldValue, symbol);
        }
    }
    $td.removeClass('editting');
}

//Input Character Validation
$("td").keypress(function (e) {
    const $input = $(this).closest('td').find("input");
    const $tr = $input.closest('tr');
    const $trID = $tr.attr('id');
    const charCode = e.keyCode;
    const number = $input.val().split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if(number.length > 1 && charCode == 46){
        return false;
    }
    const caratPos = getSelectionStart($input.get(0));
    const dotPos = $input.val().indexOf(".");
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
            const r = document.selection.createRange().duplicate()
            r.moveEnd('character', o.value.length)
            if (r.text == '') return o.value.length
            return o.value.lastIndexOf(r.text)
        } else return o.selectionStart
    }
});

function numberRound(number, decimals) {
    tempNumber = parseFloat(number);
    roundedNumber = (Number(number) + 1 / Math.pow(10, Number(decimals) + 1)).toFixed(decimals)
    newNumber = parseFloat(roundedNumber).toFixed(decimals);
    return newNumber;
}

function loanPayment2(newDict, newLoanTerm) {
    const homeCost = Number(numberRound(newDict["-home-cost"], 2));
    const downPaymentDollars = Number(numberRound(newDict["-down-payment-dollars"], 2));
    const downPayment = Number(numberRound(newDict["-down-payment"], 3));
    const propertyTaxRate = Number(numberRound(newDict["-property-tax-rate"], 3));
    const hoi = Number(numberRound(newDict["-hoi"], 2));
    const pmi = Number(numberRound(newDict["-pmi"], 3));
    const hoa = Number(numberRound(newDict["-hoa"], 2));
    const extraPayment = Number(numberRound(newDict["-extra-payment"], 2));
    const interestRate = Number(numberRound(newDict["-interest-rate"], 3));
    const loanTerm = parseInt(newLoanTerm);
    /*
    var hc = Number(numberRound(newDict["-home-cost"], 2));
    var dpd = Number(numberRound(newDict["-down-payment-dollars"], 2));
    var lt = parseInt(newLoanTerm);
    var ir = Number(numberRound(newDict["-interest-rate"], 3));
    var hoa = Number(numberRound(newDict["-hoa"], 2));
    var ptr = Number(numberRound(newDict["-property-tax-rate"], 3));
    var pmi = Number(numberRound(newDict["-pmi"], 3));
    var hoi = Number(numberRound(newDict["-hoi"], 2));
    var xp = Number(numberRound(newDict["-extra-payment"], 2));
    */
    var monthlyPropertyTax = ((propertyTaxRate/100)*homeCost)/12;
    //var downPaymentAmount = dpd;
    //var dp = (downPaymentDollars/homeCost)*100;
    var P = homeCost - downPaymentDollars;
    var i = interestRate/100/12;
    var n = loanTerm*12;
    var M = P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
    var monthlyPMI = 0;
    if (downPayment < 20) {
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

    for (var j = 0; j < n; j++) {
        interestPayment = newP*i;
        totalInterest = totalInterest + interestPayment;
        principalPayment = M - interestPayment;
        newP = newP - principalPayment;
        if (newP/homeCost > .8) {
            totalPMI = totalPMI + monthlyPMI;
            equity = equity + 1;
        }
    }
    var totalCost = homeCost + totalInterest + totalPMI + totalHOI + totalHOA + totalPropertyTax;
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
    if (extraPayment > 0) {
        var newP = P;
        var interestPayment = 0;
        var totalInterest = 0;
        var newPMI = 0;
        var principalPayment = 0;
        var totalPMI = 0;
        var equity = 0;
        var mdcount = 0;
        var M = extraPayment + P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
        for (var j = 0; j < n; j++) {
            mdcount = mdcount + 1;
            interestPayment = newP*i;
            totalInterest = totalInterest + interestPayment;
            principalPayment = M - interestPayment;
            newP = newP - principalPayment;
            if (newP/homeCost > .8) {
                totalPMI = totalPMI + monthlyPMI;
                equity = equity + 1;
            }
            if (newP < 1) {
                break;
            }
        }
        var totalPropertyTax = monthlyPropertyTax*mdcount;
        var totalHOI = hoi*mdcount;
        var totalHOA = hoa*mdcount;
        dict["-extra-payment-total-interest-paid"] = numberRound(totalInterest, 2);
        var totalCost2 = homeCost + totalInterest + totalPMI + totalHOI + totalHOA + totalPropertyTax;
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

function cellWrongText(x, y, z) {
    //$("#"+x+"-help-block").show();
    if (x.match(/down-payment.*/)) {
        $("#" + x + "-check").attr('class', 'has-error');
    } else if(x.match(/interest-rate-.*/)) {
        $("#" + x + "-check").attr('class', 'has-error');
    } else {
        $("#" + x + "-group").attr('class', 'form-group form-group-md nopadding has-error ' + y);
    }
    $("#" + x + "-glyph").attr('class', 'glyphicon glyphicon-remove form-control-feedback glyphicon-' + z);
    return;
}

function cellValidate(t) {
    var $input = $(t);
    
    if ($input.length == 0) {
        return 2;
    }
    
    var $td = $input.closest('td');
    //var $tdID = $td.attr('id');
    var $tdIndex = $td.index();
    var $tr = $input.closest('tr');
    var $trID = $tr.attr('id');
    
    //alert($input.val());
    var x = removeCommas($input.val());
    //alert(x);

    var $homeCost = removeCommas($('#-home-cost').find('td').eq($tdIndex - 1).text());
    var $downPaymentDollars = removeCommas($('#-down-payment-dollars').find('td').eq($tdIndex - 1).text());
    var $downPayment = removeCommas($('#-down-payment').find('td').eq($tdIndex - 1).text());
    var $loanTerm = $('#-loan-term').find('td').eq($tdIndex - 1).find('.dropdown-toggle').text().replace(" years","").trim();
    var $interestRate = removeCommas($('#-interest-rate').find('td').eq($tdIndex - 1).text());
    var $hoa = removeCommas($('#-hoa').find('td').eq($tdIndex - 1).text());
    var $propertyTaxRate = removeCommas($('#-property-tax-rate').find('td').eq($tdIndex - 1).text());
    var $pmi = removeCommas($('#-pmi').find('td').eq($tdIndex - 1).text());
    var $hoi = removeCommas($('#-hoi').find('td').eq($tdIndex - 1).text());
    var $extraPayment = removeCommas($('#-extra-payment').find('td').eq($tdIndex - 1).text());
    var $squareFootage = removeCommas($('#-square-footage').find('td').eq($tdIndex - 1).text());
    if ($input.attr('id').match(/-home-cost*/)) {
        var $homeCost = removeCommas($input.val());
    } else if ($input.attr('id').match(/-down-payment-dollars*/)) {
        var $downPaymentDollars = removeCommas($input.val());
    } else if ($input.attr('id').match(/-down-payment*/)) {
        var $downPayment = removeCommas($input.val());
    } else if ($input.attr('id').match(/-loan-term*/)) {
        var $loanTerm = removeCommas($input.val());
    } else if ($input.attr('id').match(/-interest-rate*/)) {
        var $interestRate = removeCommas($input.val());
    } else if ($input.attr('id').match(/-hoa*/)) {
        var $hoa = removeCommas($input.val());
    } else if ($input.attr('id').match(/-property-tax-rate*/)) {
        var $propertyTaxRate = removeCommas($input.val());
    } else if ($input.attr('id').match(/-pmi*/)) {
        var $pmi = removeCommas($input.val());
    } else if ($input.attr('id').match(/-hoi*/)) {
        var $hoi = removeCommas($input.val());
    } else if ($input.attr('id').match(/-extra-payment*/)) {
        var $extraPayment = removeCommas($input.val());
    } else if ($input.attr('id').match(/-square-footage*/)) {
        var $squareFootage = removeCommas($input.val());
    }

    var validate = 1;
    var errorText = "";
    switch($trID){
        case "-home-cost":
            errorText = 'Please enter a value between 10,000 and 1 billion.'
            if (x.length == 0) {
                validate = 0;
                textRequired($trID, "required", "right");
            } else {
                if (x < 10000 || +x > 1000000000) {
                    validate = 0;
                    cellWrongText($trID, "required", "right");
                } else {
                    if ($downPaymentDollars.length > 0 && $downPayment.length == 0) {
                        $('#-down-payment').val(((+$downPaymentDollars/+x)*100).toFixed(3));
                        correctText("-down-payment", "required", "left");
                        $("#down-payment-label").css("color", "#3c763d");
                    } else if ($downPayment.length > 0) {
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
            errorText = 'Please enter a value less than the home cost.'
            if (x.length == 0) {
                if ($downPayment.length == 0) {
                    textRequired("down-payment-dollars", "required", "right");
                    $("#down-payment-label").css("color", "#a94442");
                    textRequired("down-payment", "required", "left");
                    textNotRequired("pmi", "", "left");
                } else {
                    $("#down-payment-dollars").val(addCommas((+$downPayment/100)*$homeCost));
                    correctText("down-payment-dollars", "required", "right");
                    $("#down-payment-label").css("color", "#3c763d");
                    if (+$downPayment < 20) {
                        $("#pmi-group").attr('class', 'form-group form-group-md nopadding required')
                    } else {
                        $("#pmi-group").attr('class', 'form-group form-group-md nopadding')
                    }
                    correctText("down-payment", "required", "left");
                }
            } else {
                if ($homeCost.length == 0) {
                    validate = 0;
                    correctText($trID, "required", "right");
                    if ($downPayment.length == 0) {
                        //$('#down-payment').val("0.000");
                    } else {
                        correctText("down-payment", "required", "left");
                    }
                    $("#down-payment-label").css("color", "#3c763d");
                } else {
                    if (+x >= +$homeCost) {
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
                        if (+$downPayment < 20) {
                            $("#pmi-group").attr('class', 'form-group form-group-md nopadding required')
                        } else {
                            $("#pmi-group").attr('class', 'form-group form-group-md nopadding')
                        }
                    }
                }
            }
            break;
        case "-down-payment":
            errorText = 'Please enter a value between 0 and 99.'
            if (x.length == 0) {
                if ($downPaymentDollars.length == 0) {
                    textRequired("down-payment", "required", "left");
                    $("#down-payment-label").css("color", "#a94442");
                    textRequired("down-payment-dollars", "required", "right");
                    textNotRequired("pmi", "", "left");
                } else {
                    if (+$homeCost >= 10000 && +$homeCost <= 1000000000) {
                        $("#down-payment").val(((+$downPaymentDollars/+$homeCost)*100).toFixed(3));
                        correctText("down-payment", "required", "right");
                        $("#down-payment-label").css("color", "#3c763d");
                        $downPayment = $('#down-payment').val();
                        if (+$downPayment < 20) {
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
                if (+x > 99 ) {
                    validate = 0;
                    wrongText($trID, "required", "left");
                    wrongText("down-payment-dollars", "required", "right");
                    $("#down-payment-label").css("color", "#a94442");
                } else {
                    if (+x >= 20) {
                        textNotRequired("pmi", "", "left");
                    } else {
                        if ($pmi.length > 0) {
                            if (+$pmi > 10) {
                                wrongText("pmi", "required", "left");
                            } else {
                                correctText("pmi", "required", "left");
                            }
                        } else {
                            if ($('#pmi-group').hasClass("has-error")) {
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
        case "-hoa":
            errorText = 'Please enter a value between 0 and 1,000.'
            if (x.length == 0) {
                textNotRequired($trID, "", "center");
            } else {
                if (+$hoa > 1000 ) {
                    validate = 0;
                    wrongText($trID, "", "center");
                } else {
                    correctText($trID, "", "center");
                }
            }
            break;
        case "-property-tax-rate":
            errorText = 'Please enter a value between 0 and 10.'
            if (x.length == 0) {
                validate = 0;
                textRequired($trID, "required", "left");
            } else {
                if (+$propertyTaxRate > 10 ) {
                    validate = 0;
                    wrongText($trID, "required", "left");
                } else {
                    correctText($trID, "required", "left");
                }
            }
            break;
        case "-pmi":
            errorText = 'Please enter a value between 0 and 10.'
            if (x.length == 0){
                if ($downPayment.length > 0) {
                    if (+$downPayment >= 20) {
                        textNotRequired($trID, "", "left");
                    } else {
                        validate = 0;
                        textRequired($trID, "required", "left");
                        $("#pmi-group").attr('class', 'form-group form-group-md nopadding required has-error');
                    }
                } else {
                    textNotRequired("pmi", "", "left");
                }
            } else {
                if ($downPayment.length > 0) {
                    if (+$downPayment >= 20) {
                        textNotRequired("pmi", "", "left");
                    } else {
                        if (+$pmi > 10 ) {
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
        case "-hoi":
            errorText = 'Please enter a value between 0 and 1,000.'
            if (x.length == 0) {
                textRequired($trID, "required", "center");
            } else {
                if (+$hoi > 1000 ) {
                    validate = 0;
                    wrongText($trID, "required", "center");
                } else {
                    correctText($trID, "required", "center");
                }
            }
            break;
        case "-extra-payment":
            errorText = 'Please enter a value between 0 and 5,000.'
            if (x.length == 0) {
                textNotRequired($trID, "", "center");
            } else {
                if (+$extraPayment > 5000) {
                    validate = 0;
                    wrongText($trID, "", "center");
                } else {
                    correctText($trID, "", "center");
                }
            }
            break;
        case "-square-footage":
            errorText = 'Please enter a value between 100 and 100,000.'
            if (x.length == 0 || x < 100) {
                validate = 0;
                textRequired($trID, "", "center");
            } else {
                if (+$squareFootage > 100000) {
                    validate = 0;
                    wrongText($trID, "", "center");
                } else {
                    correctText($trID, "", "center");
                }
            }
            break;
        case "-interest-rate":
            errorText = 'Please enter a value between 1 and 25.'
            if (x.length == 0 || x < 1) {
                validate = 0;
                textRequired($trID, "", "center");
            } else {
                if (+$interestRate > 25) {
                    validate = 0;
                    wrongText($trID, "", "center");
                } else {
                    correctText($trID, "", "center");
                }
            }
            break;
    }
    return [validate, errorText];
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
        var formHeight = $( "#myForm" ).height();
        var windowHeight = $(window).height();
        var newTop = (windowHeight - formHeight)/2;
        $( "#modalMe" ).addClass("modal-me");
        $( "#modalMe" ).addClass("veilDown");
        $( "#modalMe" ).removeClass("boxShow");
        $( "#myForm" ).addClass("modal-content-me");
        $( "#myForm" ).addClass("boxDown");
        $( "#results" ).css("display", "none");
        $( "#mortgageCalculator" ).css("display", "none");
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
}

$("#myForm").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
    if ($("#myForm").hasClass('boxDown')) {
        /*$( "#myForm" ).addClass("boxUp");
        $("#myForm").removeClass('boxDown');
        $( "#modalMe" ).addClass("veilUp");
        $( "#modalMe" ).removeClass("veilDown");*/
    } else if ($("#myForm").hasClass('boxUp')) {
        $("#myForm").removeClass('boxUp');
        $( "#myForm" ).removeClass("modal-content-me");
        $( "#myForm" ).css('background-color', '#fefefe');
        $( "#mortgageCalculator" ).css("display", "block");
    }
});

$("#modalMe").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
    if ($("#myForm").hasClass('boxDown') === false && $("#myForm").hasClass('boxUp') === false) {
        var filtered = $("#myForm").not(":animated");
        if (filtered !== null) {
            if ($("#modalMe").hasClass('veilUp') === false) {
                //$( "#modalMe" ).css('background-color', '#fefefe');
                //$( "#modalMe" ).addClass("veilUp");
            } else if ($("#modalMe").hasClass('veilUp') === true) {
                $("#modalMe").removeClass('veilUp');
                $("#modalMe").removeClass('modal-me');
                calculate(loanTerm);
                $( "#results" ).css("display", "");
                $( "#results" ).removeClass("tableShow");
                $( "#results" ).removeClass("tableHide");
            }
        }
    }
});

var loanTerm;
function calculate2(lt) {
    var validate = myValidate(lt);
    if (validate == 0){
        return;
    }
    loanTerm = lt;
    if ($("#myForm").hasClass('boxDown')) {
        $("#myForm").addClass("boxUp");
        $("#myForm").removeClass('boxDown');
        $("#modalMe").addClass("veilUp");
        $("#modalMe").removeClass("veilDown");
    }
}

function toggleCalculator() {
    if ($("#modalMe").hasClass("boxHide")) {
        $("#modalMe").addClass("boxShow");
        $("#modalMe").removeClass("boxHide");
        $("#mortgageCalculator").text("^ Hide Calculator ^");
        $("#results").addClass("tableShow");
        $("#results").removeClass("tableHide");
    } else if ($("#modalMe").hasClass("boxShow")) {
        $("#modalMe").addClass("boxHide");
        $("#modalMe").removeClass("boxShow");
        $("#mortgageCalculator").text("v Show Calculator v");
        $("#results").addClass("tableHide");
        $("#results").removeClass("tableShow");
    } else {
        $("#modalMe").addClass("boxHide");
        $("#mortgageCalculator").text("v Show Calculator v");
        $("#results").addClass("tableHide");
    }
}





/*
$("#awayButton").click(function() {
    $("#myModal").modal('hide');
     var current = $("#modalAway");      
     var prependToDiv = $('#modalHome');
    current.animate({top, 500}), 2000)
    current.prependTo(prependToDiv
  });
*/
$( "#awayButton" ).click(function() {
  $( "#myForm" ).animate({
    width: "100%",
    opacity: 0.4,
    marginLeft: "0.6in",
    fontSize: "3em",
    borderWidth: "10px"
  }, 1500 );
});

/*
$(document).ready(function() {  
    $("#awayButton").click(function() {  
        $("#div_1").swap({  
            target: "div_2", // Mandatory. The ID of the element we want to swap with  
            opacity: "0.5", // Optional. If set will give the swapping elements a translucent effect while in motion  
            speed: 1000, // Optional. The time taken in milliseconds for the animation to occur  
            callback: function() { // Optional. Callback function once the swap is complete  
                alert("Swap Complete");  
            }  
        });  
    });  
});  
*/

$(".delete").on('click', 'tbody tr td div div span', function (e){
    e.stopPropagation();
    const $this = $(this);
});

$(".delete").click(function (e){
    e.stopPropagation();
    const $this = $(this);
    const $td = $this.closest('td');
    $("tr").each(function() {
        $(this).find('td').eq($td.index() - 1).remove();
    });
    var tdCount = 0;
    $("td").each(function() {
        tdCount += 1;
    });
    if (tdCount === 0) {
        $("#table8").empty();
        $( "#modalMe" ).addClass("modal-me");
        $( "#modalMe" ).addClass("veilDown");
        $( "#modalMe" ).removeClass("boxShow");
        $( "#myForm" ).addClass("modal-content-me");
        $( "#myForm" ).addClass("boxDown");
        $( "#results" ).css("display", "none");
        $( "#mortgageCalculator" ).css("display", "none");

        //$("#myModal").modal('show');
        /*var formHeight = $( "#myForm" ).height();
        var windowHeight = $(window).height();
        var newTop = (windowHeight - formHeight)/2;
        $( "#modalMe" ).addClass("modal-me");
        $( "#myForm" ).addClass("modal-content-me");
          $( "#myForm" ).animate({
                "top": newTop
            }, 1500 );
            */
            //modal.style.display = "block";
    }
});
/*
// Get the modal
var modal = document.getElementById('modalMe');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

*/


/*
//Delete Column
function deleteCol(x){
    //alert($(this).attr('id'))
    var $td = $(this).closest('td');
    //alert($td.attr('id'))
    //var a = '[id="'+x+'"]';
    //var $index = $('#table8').find('td').eq(x);
    //alert($index.get(0))
    //$(a).remove();
    //$index.remove();
    $("tr").each(function() {
        //$(this).find("td:eq("+x+")").remove();
        $(this).find('td').eq(x).remove();
    });

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
*/
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

function myValidate(kl) {
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
        if ($loanTerm != 0) {
            var $interestRate = $('#interest-rate-apr').val().replace("%","");
        } else {
            var interestArray = [$('#interest-rate-apr').val().replace("%",""),
                                 $('#interest-rate-apr').val().replace("%",""),
                                 $('#interest-rate-apr').val().replace("%",""),
                                 $('#interest-rate-apr').val().replace("%","")];
        }
    } else {
        //Desktop
        if ($loanTerm != 0) {
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

    for (var j = 0; j < formArray.length; j++) {
        var x = $('#'+formArray[j]).val().replace(/,/g,"");
        if (x.length == 0) {
            if (formRequired[j] == "required") {
                validate = 0;
                textRequired(formArray[j], formRequired[j], formGlypPositionArray[j]);
                if (formArray[j] == "down-payment-dollars") {
                    $("#down-payment-label").css("color", "#a94442");
                }
            } else {
                textNotRequired(formArray[j], formRequired[j], formGlypPositionArray[j]);
            }
        } else {
            switch(formArray[j]) {
                case "home-cost":
                    if (+$homeCost < 10000 || +$homeCost > 1000000000) {
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "down-payment-dollars":
                    if (+$homeCost >= 10000 && +$homeCost <= 1000000000) {
                        if (+$downPaymentDollars >= +$homeCost) {
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
                    if (+$downPayment >= 100 ) {
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "hoa":
                    if (+$hoa > 1000 ) {
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "property-tax-rate":
                    if (+$propertyTaxRate > 10 ) {
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "pmi":
                    if (+$pmi > 10 ) {
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "hoi":
                    if (+$hoi > 1000 ) {
                        validate = 0;
                        wrongText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    } else {
                        correctText(formArray[j], formRequired[j], formGlypPositionArray[j]);
                    }
                    break;
                case "extra-payment":
                    if (+$extraPayment > 5000) {
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
        if ($loanTerm != 0) {
            if ($interestRate.length == 0) {
                validate = 0;
                textRequired('interest-rate-apr', "required", "left");
                $("#interest-rate-apr-label").css("color", "#a94442");
            } else {
                if (+$interestRate >= 20) {
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
            for (var k = 0; k < interestArray.length; k++) {
                if (interestArray[k].length == 0) {
                    validate = 0;
                    textRequired('interest-rate-apr', "required", "left");
                    iTest = 1;
                } else {
                    if (+interestArray[k] >= 20) {
                        validate = 0;
                        wrongText('interest-rate-apr', "required", "left");
                        iTest = 1;
                    } else {
                        correctText('interest-rate-apr', "required", "left");
                    }
                }
            }
            if (iTest == 1) {
                $("#interest-rate-apr-label").css("color", "#a94442");
            } else {
                $("#interest-rate-apr-label").css("color", "#3c763d");
            }
        }
    } else {
        //Desktop
        if ($loanTerm != 0) {
            if ($interestRate.length == 0) {
                validate = 0;
                textRequired('interest-rate-'+$loanTerm, "required", "left");
                $("#interest-rate-label").css("color", "#a94442");
            } else {
                if (+$interestRate >= 20) {
                    validate = 0;
                    wrongText('interest-rate-'+$loanTerm, "required", "left");
                    $("#interest-rate-label").css("color", "#a94442");
                } else {
                    correctText('interest-rate-'+$loanTerm, "required", "left");
                    $("#interest-rate-label").css("color", "#3c763d");
                }
            }

            for (var k = 0; k < loanTermArray.length; k++) {
                if (+loanTermArray[k] != +$loanTerm) {
                    textNotRequired('interest-rate-'+loanTermArray[k], "required", "left");
                }
            }
        } else {
            var iTest = 0;
            for (var k = 0; k < interestArray.length; k++) {
                if (interestArray[k].length == 0) {
                    validate = 0;
                    textRequired('interest-rate-'+loanTermArray[k], "required", "left");
                    iTest = 1;
                } else {
                    if (+interestArray[k] >= 20) {
                        validate = 0;
                        wrongText('interest-rate-'+loanTermArray[k], "required", "left");
                        iTest = 1;
                    } else {
                        correctText('interest-rate-'+loanTermArray[k], "required", "left");
                    }
                }
            }
            if (iTest == 1) {
                $("#interest-rate-label").css("color", "#a94442");
            } else {
                $("#interest-rate-label").css("color", "#3c763d");
            }
        }
    }
    return(validate);
}
function textNotRequired(x, y, z) {
    $("#"+x+"-help-block").hide();
    if (x.match(/interest-rate-.*/)) {
        $("#"+x+"-check").attr('class', 'col-sm-2');
    } else {
        $("#"+x+"-group").attr('class', 'form-group form-group-md nopadding '+y);
    }
    $("#"+x+"-glyph").attr('class', 'glyphicon form-control-feedback glyphicon-'+z);
    return;
}
function textRequired(x, y, z) {
    $("#"+x+"-help-block").hide();
    if (x.match(/down-payment.*/)) {
        $("#"+x+"-check").attr('class', 'col-sm-4 has-error');
    } else if (x.match(/interest-rate-.*/)) {
        $("#"+x+"-check").attr('class', 'col-sm-2 has-error');
    } else {
        $("#"+x+"-group").attr('class', 'form-group form-group-md nopadding has-error '+y);
    }
    $("#"+x+"-glyph").attr('class', 'glyphicon form-control-feedback glyphicon-'+z);
    return;
}
function wrongText(x, y, z) {
    $("#"+x+"-help-block").show();
    if (x.match(/down-payment.*/)) {
        $("#"+x+"-check").attr('class', 'col-sm-4 has-error');
    } else if(x.match(/interest-rate-.*/)) {
        $("#"+x+"-check").attr('class', 'col-sm-2 has-error');
    } else {
        $("#"+x+"-group").attr('class', 'form-group form-group-md nopadding has-error '+y);
    }
    $("#"+x+"-glyph").attr('class', 'glyphicon glyphicon-remove form-control-feedback glyphicon-'+z);
    return;
}
function correctText(x, y, z) {
    $("#"+x+"-help-block").hide();
    if (x.match(/down-payment.*/)) {
        $("#"+x+"-check").attr('class', 'col-sm-4 has-success');
    } else if(x.match(/interest-rate-.*/)) {
        $("#"+x+"-check").attr('class', 'col-sm-2 has-success');
    } else {
        $("#"+x+"-group").attr('class', 'form-group form-group-md nopadding has-success '+y);
    }
    $("#"+x+"-glyph").attr('class', 'glyphicon glyphicon-ok form-control-feedback glyphicon-'+z);
    return;
}

$("#home-cost, #extra-payment, #hoa, #hoi, #down-payment-dollars").focusout(function() {
    var a = $(this);
    var x = removeCommas(a.val());
    if (x.length != 0) {
        x = Number(x).toFixed(2);
        a.val(addCommas(x));
        if (this.id == "down-payment-dollars") {
            var $homeCost = removeCommas($("#home-cost").val());
            if ($homeCost != "") {
                var newdp = (x/$homeCost)*100;
                $("#down-payment").val(Number(Math.round(newdp+'e3')+'e-3').toFixed(3));
            }
        }
        if (this.id == "home-cost") {
            var $homeCost = removeCommas($("#home-cost").val());
            if ($homeCost != "") {
                var dp = $("#down-payment").val().replace("%","");
                if (dp.length != 0) {
                    var newdp = (dp/100)*$homeCost;
                    var y = addCommas(Number(Math.round(newdp)).toFixed(2));
                    $("#down-payment-dollars").val(y);
                }
            }
        }
    }
});

$("#home-cost, #extra-payment, #hoa, #hoi, #down-payment-dollars").focusin(function() {
    var a = $(this);
    var x = a.val();
    a.val(removeCommas(x));
    a.select();
});

$("#down-payment, [id^=interest-rate-], #property-tax-rate, #pmi").focusout(function() {
    var a = $(this);
    var x = a.val();
    if (x != "") {
        var temp = Number(a.val()).toFixed(3);
        a.val(temp);
        if (this.id == "down-payment") {
            var $homeCost = removeCommas($("#home-cost").val());
            var newDownPaymentDollars = ((temp/100)*$homeCost);
            var y = addCommas(Number(newDownPaymentDollars).toFixed(2));
            $("#down-payment-dollars").val(y);
        }
    }
});

$("#down-payment, [id^=interest-rate-], #property-tax-rate, #pmi").focusin(function() {
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

function calculate(kl) {
    //Validate Form Fields
    var validate = myValidate(kl);
    if (validate == 0) {
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
        if ($loanTerm != 0) {
            var $interestRate = +$('#interest-rate-apr').val().replace("%","");
        } else {
            var interestArray = [+$('#interest-rate-apr').val().replace("%",""),
                                 +$('#interest-rate-apr').val().replace("%",""),
                                 +$('#interest-rate-apr').val().replace("%",""),
                                 +$('#interest-rate-apr').val().replace("%","")];
        }
    } else {
        //Desktop
        if ($loanTerm != 0) {
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

    if ($loanTerm == 0) {
        for (var t = 0; t < termArray.length; t++) {
            var dict = loanPayment($homeCost, $downPayment, termArray[t], interestArray[t], $hoa, $propertyTaxRate, $pmi, $hoi, $extraPayment);
            //var googleSend = $homeCost + ";" + $downPayment + ";" + $propertyTaxRate + ";" + $hoi + ";" + $pmi + ";" + $hoa + ";" + $extraPayment + ";" + interestArray[t] + ";" + termArray[t];
            //ga('send', 'event', 'Calculations', 'Calculate', googleSend);
            var lt = termArray[t];
            var i = interestArray[t]/100/12;
            var n = termArray[t]*12;
            var tempArray = [];
            var temploop = [10, 15, 20, 30];
            for (var w = 0; w < temploop.length; w++) {
                if (lt >= temploop[w]) {
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
            for (var y = 0; y < dataArray.length; y++) {
                if (y != 0 && y != 5 && y != 12 && y != 17 && y != 20 && y != 25) {
                    var column = document.createElement("td");
                    column.id = columnID;
                    if (y == 1) {
                        var text = document.createTextNode(dataArray[y]+" years");
                    } else if (y == 2 || y == 14 || y == 18) {
                        var text = document.createTextNode(dataArray[y]);
                    } else {
                        var text = document.createTextNode("$"+addCommas(dataArray[y].toFixed(2)));
                    }
                    column.appendChild(text);
                    rowArray[y].appendChild(column);

                    if (y == dataArray.length - 1) {
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
            for (var z = 0; z <= rowArray.length; z++) {
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
        for (var w = 0; w < temploop.length; w++) {
            if ($loanTerm >= temploop[w]) {
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
        for (var y = 0; y < dataArray.length; y++) {
            if (y != 0 && y != 5 && y != 10 && y != 17 && y != 22 && y != 25 && y != 30){
                var column = document.createElement("td");
                column.id = columnID;
                if (y == 2) {
                    var text = document.createTextNode(addCommas(dataArray[y]));
                } else if (y == 6) {
                    var text = document.createTextNode(dataArray[y]+" years");
                } else if (y == 4 || y == 7 || y == 19 || y == 23) {
                    var text = document.createTextNode(dataArray[y]);
                } else {
                    var text = document.createTextNode("$"+addCommas(dataArray[y].toFixed(2)));
                }
                column.appendChild(text);
                rowArray[y].appendChild(column);

                if (y == dataArray.length - 1) {
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

        for (var z = 0; z < rowArray.length; z++) {
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
    function earlymploop2(d, lt, i) {
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
        for (var j = 0; j < n; j++) {
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
        
        for (var q = 0; q < array1.length; q++) {
            for (var m = 0; m < array1[q]; m+=array2[q]) {
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
                for (var j = 0; j < n; j++) {
                    mdcount = mdcount + 1;
                    interestPayment = newP*i;
                    totalInterest2 = totalInterest2 + interestPayment;
                    principalPayment = M2 - interestPayment;
                    newP = newP - principalPayment;
                    if (newP < 1) {
                        break;
                    }
                    if (mdcount > md) {
                        break;
                    }
                }
                var addM = M2 - minM;
                if (mdcount > md) {
                    low = low + m;
                }else if (mdcount < md) {
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

function loanPayment(hc, dp, lt, ir, hoa, ptr, pmi, hoi, xp) {
    
    var monthlyPropertyTax = ((ptr/100)*hc)/12;
    var downPaymentAmount = (dp/100)*hc;
    var P = hc - downPaymentAmount;
    var i = ir/100/12;
    var n = lt*12;
    var M = P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
    var monthlyPMI = 0;
    if (dp < 20) {
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

    for (var j = 0; j < n; j++) {
            interestPayment = newP*i;
            totalInterest = totalInterest + interestPayment;
            principalPayment = M - interestPayment;
            newP = newP - principalPayment;
            if (newP/hc > .8) {
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
    if (xp > 0) {
        var newP = P;
        var interestPayment = 0;
        var totalInterest = 0;
        var newPMI = 0;
        var principalPayment = 0;
        var totalPMI = 0;
        var equity = 0;
        var mdcount = 0;
        var M = xp + P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);

        for (var j = 0; j < n; j++) {
            mdcount = mdcount + 1;
            interestPayment = newP*i;
            totalInterest = totalInterest + interestPayment;
            principalPayment = M - interestPayment;
            newP = newP - principalPayment;
            if (newP/hc > .8) {
                totalPMI = totalPMI + monthlyPMI;
                equity = equity + 1;
            }
            if (newP < 1) {
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Testing
//Column Highlighting
/*
$(document).ready(function() {
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
);
*/

//Arrow Function Example
/*var arr = 5;
var squares = (x, y) => x*y;
alert(squares(arr, arr));*/