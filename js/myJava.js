$("#home-cost, #extra-payment, #hoa, #hmi, #down-payment-dollars").focusout(function(){
    var a = $(this);
    var x = a.val();
    if (x != ""){
        a.val("$"+addCommas(x));
        if (this.id == "down-payment-dollars"){
            var hv = removeCommas($("#home-cost").val());
            var newdp = (x/hv)*100;
            $("#down-payment").val(Number(Math.round(newdp+'e3')+'e-3').toFixed(3)+"%");
        }
        if (this.id == "home-cost"){
            var hv = removeCommas($("#home-cost").val());
            var dp = $("#down-payment").val().replace("%","");
            var newdp = (dp/100)*hv;
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
            var hv = removeCommas($("#home-cost").val());
            var newdpd = (temp/100)*hv;
            var y = addCommas(Number(Math.round(newdpd)));
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



function test(){
//Testing
//var radio = $("input[name='options']:checked").val();

    //Erase Existing Results
    $("#table1").empty();
    $("#table2").empty();
    $("#table3").empty();
    $("#table4").empty();
    $("#table5").empty();
    $("#table6").empty();

    /*var hv = Number(document.getElementById("home-cost").value.replace(/,/g,"").replace("$",""));
    var dp = Number(document.getElementById("down-payment").value.replace("%",""));
    var dpd = Number(document.getElementById("down-payment-dollars").value.replace(/,/g,"").replace("$",""));
    var ir = Number(document.getElementById("interest-rate").value.replace("%",""));
    //var lt = Number(document.getElementById("loan-term").value.replace(" years",""));
    var lt = $("input[name='loan-term']:checked").val();
    var hoa = Number(document.getElementById("hoa").value.replace(/,/g,"").replace("$",""));
    var ptr = Number(document.getElementById("property-tax-rate").value.replace("%",""));
    var pmi = Number(document.getElementById("pmi").value.replace("%",""));
    var hmi = Number(document.getElementById("hmi").value.replace(/,/g,"").replace("$",""));
    var xm = Number(document.getElementById("extra-payment").value.replace(/,/g,"").replace("$",""));

    var mpt = ((ptr/100)*hv)/12;

    var dpa = (dp/100)*hv;
    var P = hv - dpa;
    var mpmi = 0;

    if (dp < 20){
        mpmi = ((pmi/100)*P)/12;
    }
    
    var i = ir/100/12;
    var n = lt*12;
    var M = xm + P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);

    var tmp = M + hoa + mpt + mpmi + hmi;

    document.getElementById("dp").innerHTML = "$" + addCommas(Number(Math.round(dpa+'e2')+'e-2').toFixed(2));
    document.getElementById("la").innerHTML = "$" + addCommas(Number(Math.round(P+'e2')+'e-2').toFixed(2));
    document.getElementById("mp").innerHTML = "$" + addCommas(Number(Math.round(M+'e2')+'e-2').toFixed(2));
    document.getElementById("mpt").innerHTML = "$" + addCommas(Number(Math.round(mpt+'e2')+'e-2').toFixed(2));
    document.getElementById("mpmi").innerHTML = "$" + addCommas(Number(Math.round(mpmi+'e2')+'e-2').toFixed(2));
    document.getElementById("mhmi").innerHTML = "$" + addCommas(Number(Math.round(hmi+'e2')+'e-2').toFixed(2));
    document.getElementById("tmp").innerHTML = "$" + addCommas(Number(Math.round(tmp+'e2')+'e-2').toFixed(2));

    var newP = P;
    var newi = 0;
    var ti = 0;
    var newpmi = 0;
    var principal = 0;
    var tpmi = 0;
    var equity = 0;

    for (var j = 0; j < n; j++){
        if (newP >= M){
            newi = newP*i;
            ti = ti + newi;
            principal = M - newi;
            newP = newP - principal;
            if (newP/hv > .8){
                tpmi = tpmi + mpmi;
                equity = equity + 1;
            }
        }else{
            newi = newP*i;
            ti = ti + newi;
            principal = M - newi;
            newP = newP - principal;
            break;
        }
    }
    document.getElementById("tpmi").innerHTML = "$" + addCommas(Number(Math.round(tpmi+'e2')+'e-2').toFixed(2));
    document.getElementById("equity").innerHTML = equity + " months";
    document.getElementById("ti").innerHTML = "$" + addCommas(Number(Math.round(ti+'e2')+'e-2'));*/

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
                        "Monthly Property Tax", "Monthly pmi", "Monthly Home Owner's Imsurance",
                        "Total Monthly Payment", "Total pmi", "Months Until 20% Equity", "Total Interest Paid"];
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
    //var interestArray = [3.125, 3.250, 3.725, 4.025];
    //var interestArray = [$interestRate]
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


            var istring =  Number(Math.round(interestArray[t]+'e3')+'e-3').toFixed(3)+"%";
            var dataArray = [termArray[t], istring, downPaymentAmount, P, M, monthlyPropertyTax, monthlyPMI,
                            $hmi, totalMonthlyPayment, totalPMI, equity, totalInterest];

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
        var istring =  Number(Math.round($interestRate+'e3')+'e-3').toFixed(3)+"%";
        var dataArray = [$loanTerm, istring, downPaymentAmount, P, M, monthlyPropertyTax, monthlyPMI,
                          $hmi, totalMonthlyPayment, "totalpmi", "monthsEquity", "totalInterest"];

        for (var y = 0; y < dataArray.length; y++){
            var column = document.createElement("div");
            if (y == 0){
                column.className = "divTableCell  divTableHeader";
            } else {
                column.className = "divTableCell  divTableInnerL";
            }
            if (y == 0){
                var text = document.createTextNode(dataArray[y]+" years");
            } else if (y > 1 && y < 9){
                var text = document.createTextNode("$"+addCommas(dataArray[y].toFixed(2)));
            } else {
                var text = document.createTextNode(dataArray[y]);
            }
            column.appendChild(text);
            rowArray[y].appendChild(column);
        }
        for (var z = 0; z < rowArray.length; z++){
            $table6.append(rowArray[z]);
        }
    }




    var cti = ti;
    fhadataArray = [dpa, P, mpmi, tpmi, equity, ti, 0];
    //FHA (3.5%)
    //Table Header
    var table4 = $("#table4");
    var fhatextArray = ["DP", "LA", "pmi", "Total pmi", "20% Equity", "TI", "TS", "ACB"];
    var fhadp = (3.5/100)*hv;
    var fharowArray = [];
    var fhala = hv - fhadp;
    var fhapmi = ((pmi/100)*fhala)/12;


    var fharow = document.createElement("div");
    fharow.className = "divTableRow divTableHeader";
    table4.append(fharow);
    var fhacolumn = document.createElement("div");
    fhacolumn.className = "divTableCell divTableHeader";
    var fhatext = document.createTextNode("LT");
    fhacolumn.appendChild(fhatext);
    fharow.appendChild(fhacolumn);

    var fhacolumn = document.createElement("div");
    fhacolumn.className = "divTableCell divTableHeader";
    var fhatext = document.createTextNode("Conventional (20%)");
    fhacolumn.appendChild(fhatext);
    fharow.appendChild(fhacolumn);

    var fhacolumn = document.createElement("div");
    fhacolumn.className = "divTableCell divTableHeader";
    var fhatext = document.createTextNode("FHA (3.5%)");
    fhacolumn.appendChild(fhatext);
    fharow.appendChild(fhacolumn);

    for (var z = 0; z < fhatextArray.length; z++){
        var row = document.createElement("tr");
        var column = document.createElement("div");
        column.className = "divTableCell  divTableHeader";
        var text = document.createTextNode(fhatextArray[z]);
        column.appendChild(text);
        row.appendChild(column);
        fharowArray.push(row);
    }

    

    for (var y = 0; y < fhadataArray.length; y++){
        var fhacolumn = document.createElement("div");
        fhacolumn.className = "divTableCell";
        fhacolumn.style = "border: 1px solid black;";
        var fhatext = document.createTextNode(addCommas(fhadataArray[y].toFixed(2)));
        fhacolumn.appendChild(fhatext);
        fharowArray[y].appendChild(fhacolumn);
    }

    var newP = fhala;
    var newi = 0;
    var ti = 0;
    var newpmi = 0;
    var principal = 0;
    var tpmi = 0;
    var equity = 0;

    for (var j = 0; j < n; j++){
        if (newP >= M){
            newi = newP*i;
            ti = ti + newi;
            principal = M - newi;
            newP = newP - principal;
            if (newP/hv > .8){
                tpmi = tpmi + fhapmi;
                equity = equity + 1;
            }
        }else{
            newi = newP*i;
            ti = ti + newi;
            principal = M - newi;
            newP = newP - principal;
            break;
        }
    }
    
    fhadataArray = [fhadp, fhala, fhapmi, tpmi, equity, ti, cti-ti];

    for (var y = 0; y < fhadataArray.length; y++){
        var fhacolumn = document.createElement("div");
        fhacolumn.className = "divTableCell";
        fhacolumn.style = "border: 1px solid black;";
        var fhatext = document.createTextNode(addCommas(fhadataArray[y].toFixed(2)));
        fhacolumn.appendChild(fhatext);
        fharowArray[y].appendChild(fhacolumn);
    }

    for (var y = 0; y < fharowArray.length; y++){
        table4.append(fharowArray[y]);
    }

    //Div Table Test
    //Create Headers for Extra Monthly Payments and Extra Down Payment
    var table = document.getElementById("table1");
    var row0 = document.createElement("div");
    row0.className = "divTableRow divTableHeader";
    table.appendChild(row0);

    var column2 = document.createElement("div");
    column2.className = "divTableCell divTableHeader";
    var text2 = document.createTextNode("IR");
    column2.appendChild(text2);
    row0.appendChild(column2);

    var table2 = document.getElementById("table2");
    var row2 = document.createElement("div");
    row2.className = "divTableRow divTableHeader";
    table2.appendChild(row2);

    var column2 = document.createElement("div");
    column2.className = "divTableCell divTableHeader";
    var text2 = document.createTextNode("IR");
    column2.appendChild(text2);
    row2.appendChild(column2);

    /*var table3 = document.getElementById("table3");
    var row3 = document.createElement("div");
    row3.className = "divTableRow divTableHeader";
    table3.appendChild(row3);

    var column3 = document.createElement("div");
    column3.className = "divTableCell divTableHeader";
    var text3 = document.createTextNode("IR");
    column3.appendChild(text3);
    row3.appendChild(column3);*/

    for (var k = 0; k < 2.25; k+=.25){
        var column0 = document.createElement("div");
        column0.className = "divTableCell divTableHeader";
        var temp0 = Number(ir) + k;
        var text0 = document.createTextNode(temp0.toFixed(2));
        column0.appendChild(text0);
        row0.appendChild(column0);

        var column2 = document.createElement("div");
        column2.className = "divTableCell divTableHeader";
        var temp0 = Number(ir) + k;
        var text2 = document.createTextNode(temp0.toFixed(2));
        column2.appendChild(text2);
        row2.appendChild(column2);

        /*var column3 = document.createElement("div");
        column3.className = "divTableCell divTableHeader";
        var temp0 = Number(ir) + k;
        var text3 = document.createTextNode(temp0.toFixed(2));
        column3.appendChild(text3);
        row3.appendChild(column3);*/
    }

    //Extra Monthly Payment
    var colnum = 0;
    var rownum = 0;
    var textArray = ["DP", "P", "M (min)", "TI (max)", "M (add)", "M (break-even)", "TI (break-even)"]
    var rowArray = [];

    for (var z = 0; z < textArray.length; z++){
        var row = document.createElement("tr");
        var column = document.createElement("div");
        column.className = "divTableCell  divTableHeader";
        var text = document.createTextNode(textArray[z]);
        column.appendChild(text);
        row.appendChild(column);
        rowArray.push(row);
    }

    for (var d = 20; d < 65; d+=5){
        rownum++;
        colnum = 0;
        for (var k = 0; k < 2.25; k+=.25){
            colnum++;
            if (colnum == rownum){
                var help = mploop(k);
            }
        }
        for (var y = 0; y < rowArray.length; y++){
                var column = document.createElement("div");
                column.className = "divTableCell";
                column.style = "border: 1px solid black;";
                var temp = help[y];
                var text = document.createTextNode(addCommas(temp.toFixed(2)));
                column.appendChild(text);
                rowArray[y].appendChild(column);
        }
    }
    for (var y = 0; y < rowArray.length; y++){
        table.appendChild(rowArray[y]);
    }

    //Extra Down Payment
    var colnum = 0;
    var rownum = 0;
    var row1 = document.createElement("tr");
    var column1 = document.createElement("div");
    column1.className = "divTableCell";
    column1.style = "border: 1px solid black;";
    var text1 = document.createTextNode("DP");
    column1.appendChild(text1);
    row1.appendChild(column1);

    var row2 = document.createElement("tr");
    var column2 = document.createElement("div");
    column2.className = "divTableCell";
    column2.style = "border: 1px solid black;";
    var text2 = document.createTextNode("M");
    column2.appendChild(text2);
    row2.appendChild(column2);

    var row3 = document.createElement("tr");
    var column3 = document.createElement("div");
    column3.className = "divTableCell";
    column3.style = "border: 1px solid black;";
    var text3 = document.createTextNode("P");
    column3.appendChild(text3);
    row3.appendChild(column3);
    for (var d = 20; d < 65; d+=5){
        rownum++;
        colnum = 0;
        for (var k = 0; k < 2.25; k+=.25){
            colnum++;
            if (colnum == rownum){
                var help = dploop2(k);
                var column1 = document.createElement("div");
                column1.className = "divTableCell";
                column1.style = "border: 1px solid black;";
                var temp1 = Number(Math.round(help[1]+'e2')+'e-2');
                var text1 = document.createTextNode(temp1.toFixed(2));
            }
        }
        var column1 = document.createElement("div");
        column1.className = "divTableCell";
        column1.style = "border: 1px solid black;";
        var temp1 = help[0];
        var text1 = document.createTextNode(addCommas(temp1.toFixed(2)));
        column1.appendChild(text1);
        row1.appendChild(column1);

        var column2 = document.createElement("div");
        column2.className = "divTableCell";
        column2.style = "border: 1px solid black;";
        var temp2 = help[3];
        var text2 = document.createTextNode(addCommas(temp2.toFixed(2)));
        column2.appendChild(text2);
        row2.appendChild(column2);

        var column3 = document.createElement("div");
        column3.className = "divTableCell";
        column3.style = "border: 1px solid black;";
        var temp3 = help[2];
        var text3 = document.createTextNode(addCommas(temp3.toFixed(2)));
        column3.appendChild(text3);
        row3.appendChild(column3);
        
    }
    table2.appendChild(row1);
    table2.appendChild(row2);
    table2.appendChild(row3);

    //Test Exact Calculations for Monthly Payment
    var low = 0;

    //Early Mortgage Payoff (Extra Monthly Payment)
    var table3 = document.getElementById("table3");
    var row3 = document.createElement("div");
    row3.className = "divTableRow divTableHeader";
    table3.appendChild(row3);

    var column3 = document.createElement("div");
    column3.className = "divTableCell divTableHeader";
    var text3 = document.createTextNode("Years");
    column3.appendChild(text3);
    row3.appendChild(column3);

    for (var k = 15; k > 0; k-=1){
        var column3 = document.createElement("div");
        column3.className = "divTableCell divTableHeader";
        var text3 = document.createTextNode(k);
        column3.appendChild(text3);
        row3.appendChild(column3);
    }

    var textArray = ["Months", "M (add)", "TI", "Savings"]
    var rowArray = [];

    for (var z = 0; z < textArray.length; z++){
        var row = document.createElement("tr");
        var column = document.createElement("div");
        column.className = "divTableCell  divTableHeader";
        var text = document.createTextNode(textArray[z]);
        column.appendChild(text);
        row.appendChild(column);
        rowArray.push(row);
    }

    for (var d = 15; d > 0; d-=1){
        var help = earlymploop(d);
        for (var y = 0; y < rowArray.length; y++){
                var column = document.createElement("div");
                column.className = "divTableCell";
                column.style = "border: 1px solid black;";
                var temp = help[y];
                var text = document.createTextNode(addCommas(temp.toFixed(2)));
                column.appendChild(text);
                rowArray[y].appendChild(column);
        }
    }
    for (var y = 0; y < rowArray.length; y++){
        table3.appendChild(rowArray[y]);
    }

    //Early Mortgage Payoff Loop (Extra Monthly Payment)
    function earlymploop(d){
        //var array1 = [21000, 1100, 110, 11, 1.1, .11, .011, .0011];
        //var array2 = [1000, 100, 10, 1, .1, .01, .001, .0001];
        var array1 = [10000, 1];
        var array2 = [1, .001];
        /*if (d == 1){
            P = hv - dpd;
            i = (ir/100)/12;
            n = lt*12;
            M = P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
            alert(M);
            var digit = (''+M)[4];
            alert(digit);
        }*/
        var maxti = 0;
        //maxti Calculation
        P = hv - dpd;
        i = (ir/100)/12;
        n = lt*12;
        M = P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
        newP = P;
        newi = 0;
        ti = 0;
        principal = 0;
        for (var j = 0; j < n; j++){
            mdcount = mdcount + 1;
            newi = newP*i;
            ti = ti + newi;
            principal = M - newi;
            newP = newP - principal;
        }
        maxti = ti;
        var low = 0;
        var maxSwitch = 0;
        var savings = 0;
        var md = d*12;
        var mdcount = 0;
        xm = 0;
        for (var q = 0; q < array1.length; q++){
            for (var m = 0; m < array1[q]; m+=array2[q]){
                var mdcount = 0;
                P = hv - dpd;
                i = (ir/100)/12;
                n = lt*12;
                xm = low + m;
                M = xm + P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
                var minM = M - xm;
                newP = P;
                newi = 0;
                ti = 0;
                principal = 0;
                for (var j = 0; j < n; j++){
                    mdcount = mdcount + 1;
                    newi = newP*i;
                    ti = ti + newi;
                    principal = M - newi;
                    newP = newP - principal;
                    if (newP < 1){
                        break;
                    }
                    if (mdcount > md){
                        break;
                    }
                }
                var addM = M - minM;
                if (mdcount > md){
                    low = low + m;
                }else if (mdcount < md){
                    //low = low;
                }else{
                    break;
                }
            }
        }
        /*if (d == 15){
            maxti = ti;
            savings = maxti - ti;
            return [mdcount, addM, ti, newP, savings, maxti];
        }else{
            
        }*/
        savings = maxti - ti;
        return [mdcount, addM, ti, savings];
    }

    //Month Loop
    function mploop(k){
        var array1 = [1100, 110, 11, 1.1, .11, .011, .0011];
        var array2 = [100, 10, 1, .1, .01, .001, .0001];
        var low = 0;
        var maxSwitch = 0;
        var maxti = 0;
        for (var q = 0; q < array1.length; q++){
            for (var m = 0; m < array1[q]; m+=array2[q]){
                var temp0 = Number(ir) + k;
                var dp2 = dpd;
                P = hv - (dp/100)*hv;
                i = temp0/100/12;
                n = lt*12;
                xm = low + m;
                M = xm + P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
                var minM = M - xm;
                newP = P;
                newi = 0;
                ti = 0;
                principal = 0;
                for (var j = 0; j < n; j++){
                    if (newP >= M){
                        newi = newP*i;
                        ti = ti + newi;
                        principal = M - newi;
                        newP = newP - principal;
                    }else{
                        newi = newP*i;
                        ti = ti + newi;
                        principal = M - newi;
                        newP = newP - principal;
                        break;
                    }
                }
                if (maxSwitch == 0){
                    maxti = ti;
                    maxSwitch = 1;
                }
                var addM = M - minM;
                if (k == 0){
                    static = ti;
                    break;
                }
                if (ti >= static){
                    low = low + m;
                }else {
                    break;
                }
            }
        }
        return [dp2, P, minM, maxti, addM, M, ti];
    }

    
    //DP Loop
    function dploop(k){
        var array1 = [110, 11, 1.1, .11, .011, .0011];
        var array2 = [10, 1, .1, .01, .001, .0001];
        var lowdp = 0;
        for (var q = 0; q < array1.length; q++){
            for (var m = 0; m < array1[q]; m+=array2[q]){
                var temp0 = Number(ir) + k;
                var tempdp = dp + lowdp + m;
                P = hv - (tempdp/100)*hv;
                i = temp0/100/12;
                n = lt*12;
                M = P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
                newP = P;
                newi = 0;
                ti = 0;
                principal = 0;
                for (var j = 0; j < n; j++){
                    if (newP >= M){
                        newi = newP*i;
                        ti = ti + newi;
                        principal = M - newi;
                        newP = newP - principal;
                    }else{
                        newi = newP*i;
                        ti = ti + newi;
                        principal = M - newi;
                        newP = newP - principal;
                        break;
                    }
                }
                if (k == 0){
                    static = ti;
                    break;
                }
                if (ti >= static){
                    lowdp = lowdp + m;
                }else {
                    break;
                }
            }
        }
        var ans = document.getElementById("dploop");
        ans.innerText = Number(Math.round(tempdp+'e3')+'e-3');
        return [tempdp, ti];
    }

    //DP Loop 2
    function dploop2(k){
        var array1 = [110000, 11000, 1100, 110, 11, 1.1, .11, .011];
        var array2 = [10000, 1000, 100, 10, 1, .1, .01, .001];
        var lowdp = 0;
        for (var q = 0; q < array1.length; q++){
            for (var m = 0; m < array1[q]; m+=array2[q]){
                var temp0 = Number(ir) + k;
                //var tempdp = dp + lowdp + m;
                var dp2 = (dp/100)*hv + lowdp + m;
                //P = hv - (tempdp/100)*hv;
                P = hv - dp2;
                i = temp0/100/12;
                n = lt*12;
                M = P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
                newP = P;
                newi = 0;
                ti = 0;
                principal = 0;
                for (var j = 0; j < n; j++){
                    if (newP >= M){
                        newi = newP*i;
                        ti = ti + newi;
                        principal = M - newi;
                        newP = newP - principal;
                    }else{
                        newi = newP*i;
                        ti = ti + newi;
                        principal = M - newi;
                        newP = newP - principal;
                        break;
                    }
                }
                if (k == 0){
                    static = ti;
                    break;
                }
                if (ti >= static){
                    lowdp = lowdp + m;
                }else {
                    break;
                }
            }
        }
        return [dp2, ti, P, M];
    }

}