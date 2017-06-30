function beta(){
    //Erase Table
    $("#table5").empty();

    //Grab User Input
    var homeCost                     = Number(document.getElementById("Home_Cost").value.replace(/,/g,"").replace("$",""));
    var downPayment                  = Number(document.getElementById("Down_Payment").value.replace("%",""));
    //var downPaymentDollars           = Number(document.getElementById("Down_Payment_Dollars").value.replace(/,/g,"").replace("$",""));
    var interestRate                 = Number(document.getElementById("Interest_Rate").value.replace("%",""));
    var loanTerm                     = Number(document.getElementById("Loan_Term").value.replace(" years",""));
    var homeOwnersAssociation        = Number(document.getElementById("HOA").value.replace(/,/g,"").replace("$",""));
    var propertyTaxRate              = Number(document.getElementById("Property_Tax_Rate").value.replace("%",""));
    var privateMortgageInsuranceRate = Number(document.getElementById("PMI").value.replace("%",""));
    var homeOwnersInsuranceDollars   = Number(document.getElementById("HMI").value.replace(/,/g,"").replace("$",""));
    var extraMonthlyPayment          = Number(document.getElementById("Extra_Payment").value.replace(/,/g,"").replace("$",""));

    //Calulate Dollar Amounts
    var monthlyPropertyTax                     = ((propertyTaxRate/100)*homeCost)/12;
    var downPaymentDollars                     = (downPayment/100)*homeCost;
    var principal                              = homeCost - downPaymentDollars;
    var monthlyPrivateMortgageInsuranceDollars = 0;
    if (downPayment < 20){
        monthlyPrivateMortgageInsuranceDollars = ((privateMortgageInsuranceRate/100)*principal)/12;
    }
    var monthlyInterestRate                    = interestRate/100/12;
    var n                                      = loanTerm*12;
    var monthlyMortgagePayment                 = extraMonthlyPayment  + principal*monthlyInterestRate*Math.pow(1+monthlyInterestRate,n)/(Math.pow(1+monthlyInterestRate,n)-1);
    var totalMonthlyPayment                    = monthlyMortgagePayment + homeOwnersAssociation + monthlyPropertyTax + monthlyPrivateMortgageInsuranceDollars + homeOwnersInsuranceDollars;

    //Calculate Loan Amortization
    var newP = homeCost - (3.5/100)*homeCost;
    var newi = 0;
    var ti = 0;
    var newpmi = 0;
    var p2 = 0;
    var tpmi = 0;
    var equity = 0;
    var i = interestRate/100/12;
    var M = newP*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
    var PMI = ((1/100)*newP)/12;
    var principal = 0;
    var tcp = (3.5/100)*homeCost;

    var table = $("#table5");
    var row = document.createElement("div");
    row.className = "divTableRow divTableHeader";
    //table.append(row);
    var column = document.createElement("div");
    column.className = "divTableCell divTableHeader";
    var text = document.createTextNode("Month");
    column.appendChild(text);
    row.appendChild(column);
    var column = document.createElement("div");
    column.className = "divTableCell divTableHeader";
    var text = document.createTextNode("Total Cash Paid (3.5%)");
    column.appendChild(text);
    row.appendChild(column);
    

    var column = document.createElement("div");
    column.className = "divTableCell divTableHeader";
    var text = document.createTextNode("Total Cash Paid (20%)");
    column.appendChild(text);
    row.appendChild(column);
    table.append(row);


        var newP2 = homeCost - (20/100)*homeCost;
        var newi2 = 0;
        var ti2 = 0;
        var newpmi2 = 0;
        var p22 = 0;
        var tpmi2 = 0;
        var M2 = newP2*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1);
        var principal2 = 0;
        var tcp2 = (20/100)*homeCost;

    for (var j = 0; j < n; j++){
        if (newP >= M){
            newi = newP*i;
            ti = ti + newi;
            p2 = M - newi;
            newP = newP - p2;
            if (newP/homeCost > .8){
                tpmi = tpmi + PMI;
            }
        }else{
            newi = newP*i;
            ti = ti + newi;
            p2 = M - newi;
            newP = newP - p2;
        }
        tcp = tcp + p2 + newi + PMI;
        /*var row = document.createElement("div");
        row.className = "divTableRow divTableHeader";
        var column = document.createElement("div");
        column.className = "divTableCell divTableHeader";
        var text = document.createTextNode(j+1);
        column.appendChild(text);
        row.appendChild(column);
        var column = document.createElement("div");
        column.className = "divTableCell";
        column.style = "border: 1px solid black; background-color: white;";
        var text = document.createTextNode((tcp).toFixed(2));
        column.appendChild(text);
        row.appendChild(column);*/

        if (newP2 >= M2){
            newi2 = newP2*i;
            ti2 = ti2 + newi2;
            p22 = M2 - newi2;
            newP2 = newP2 - p22;
        }else{
            newi2 = newP2*i;
            ti2 = ti2 + newi2;
            p22 = M2 - newi2;
            newP2 = newP2 - p22;
        }
        tcp2 = tcp2 + p22 + newi2;
        /*var column = document.createElement("div");
        column.className = "divTableCell";
        column.style = "border: 1px solid black; background-color: white;";
        var text = document.createTextNode((tcp2).toFixed(2));
        column.appendChild(text);
        row.appendChild(column);
        table.append(row);*/
        if (tcp >= tcp2){
            var row = document.createElement("div");
            row.className = "divTableRow divTableHeader";
            var column = document.createElement("div");
            column.className = "divTableCell divTableHeader";
            var text = document.createTextNode(j+1);
            column.appendChild(text);
            row.appendChild(column);
            var column = document.createElement("div");
            column.className = "divTableCell";
            column.style = "border: 1px solid black; background-color: white;";
            var text = document.createTextNode("$"+addCommas((tcp).toFixed(2)));
            column.appendChild(text);
            row.appendChild(column);
            var column = document.createElement("div");
            column.className = "divTableCell";
            column.style = "border: 1px solid black; background-color: white;";
            var text = document.createTextNode("$"+addCommas((tcp2).toFixed(2)));
            column.appendChild(text);
            row.appendChild(column);
            table.append(row);
            break;
        }
    }

//***************************************************************************


    var cti = ti;
    fhadataArray = [dpa, P, mpmi, tpmi, equity, ti, 0];
    //FHA (3.5%)
    //Table Header
    var table4 = $("#table4");
    var fhatextArray = ["DP", "LA", "pmi", "Total pmi", "20% Equity", "TI", "TS", "ACB"];
    var fhadp = (3.5/100)*$homeCost;
    var fharowArray = [];
    var fhala = $homeCost - fhadp;
    var fhapmi = ((pmi/100)*fhala)/12;


    var fharow = document.createElement("div");
    fharow.className = "divTableRow divTableHeader";
    table4.append(fharow);
    var fhacolumn = document.createElement("div");
    fhacolumn.className = "divTableCell divTableHeader";
    var fhatext = document.createTextNode("$loanTerm");
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
            if (newP/$homeCost > .8){
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
    var text2 = document.createTextNode("$interestRate");
    column2.appendChild(text2);
    row0.appendChild(column2);

    var table2 = document.getElementById("table2");
    var row2 = document.createElement("div");
    row2.className = "divTableRow divTableHeader";
    table2.appendChild(row2);

    var column2 = document.createElement("div");
    column2.className = "divTableCell divTableHeader";
    var text2 = document.createTextNode("$interestRate");
    column2.appendChild(text2);
    row2.appendChild(column2);

    /*var table3 = document.getElementById("table3");
    var row3 = document.createElement("div");
    row3.className = "divTableRow divTableHeader";
    table3.appendChild(row3);

    var column3 = document.createElement("div");
    column3.className = "divTableCell divTableHeader";
    var text3 = document.createTextNode("$interestRate");
    column3.appendChild(text3);
    row3.appendChild(column3);*/

    for (var k = 0; k < 2.25; k+=.25){
        var column0 = document.createElement("div");
        column0.className = "divTableCell divTableHeader";
        var temp0 = Number($interestRate) + k;
        var text0 = document.createTextNode(temp0.toFixed(2));
        column0.appendChild(text0);
        row0.appendChild(column0);

        var column2 = document.createElement("div");
        column2.className = "divTableCell divTableHeader";
        var temp0 = Number($interestRate) + k;
        var text2 = document.createTextNode(temp0.toFixed(2));
        column2.appendChild(text2);
        row2.appendChild(column2);

        /*var column3 = document.createElement("div");
        column3.className = "divTableCell divTableHeader";
        var temp0 = Number($interestRate) + k;
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
        var maxti = 0;
        //maxti Calculation
        P = $homeCost - $downPaymentDollars;
        i = ($interestRate/100)/12;
        n = $loanTerm*12;
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
                P = $homeCost - $downPaymentDollars;
                i = ($interestRate/100)/12;
                n = $loanTerm*12;
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
                var temp0 = Number($interestRate) + k;
                var dp2 = $downPaymentDollars;
                P = $homeCost - (dp/100)*$homeCost;
                i = temp0/100/12;
                n = $loanTerm*12;
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
                var temp0 = Number($interestRate) + k;
                var tempdp = dp + lowdp + m;
                P = $homeCost - (tempdp/100)*$homeCost;
                i = temp0/100/12;
                n = $loanTerm*12;
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
                var temp0 = Number($interestRate) + k;
                //var tempdp = dp + lowdp + m;
                var dp2 = (dp/100)*$homeCost + lowdp + m;
                //P = $homeCost - (tempdp/100)*$homeCost;
                P = $homeCost - dp2;
                i = temp0/100/12;
                n = $loanTerm*12;
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
