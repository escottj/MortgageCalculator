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
        var text = document.createTextNode((tcp).toFixed(2));
        column.appendChild(text);
        row.appendChild(column);

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
        var column = document.createElement("div");
        column.className = "divTableCell";
        column.style = "border: 1px solid black; background-color: white;";
        var text = document.createTextNode((tcp2).toFixed(2));
        column.appendChild(text);
        row.appendChild(column);
        table.append(row);
    } 
}