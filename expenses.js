let expenses = []; // model  
class Expense {  
    constructor(description, amount, date) { 
        this.description = description;
        this.amount = amount;
        this.date = date;
    }
}
let amountWarning = "please enter valid amount";
let dateWarning = "please enter valid date";
function submitExpense() {
    let description = $("#text").val(); //get the user entered description value ex:groceries//in js we write document.getElementById("text").value;
    let amount = $("#rs").val(); //get the user entered rs
    let date = $("#date").val(); //get the user entered date
    if (!checkIfAnyValidationErrors(description, amount, date)) {
        // validations succeeded
        let expense = new Expense(description, amount, date);
        //setting the table row with user entered values
        let tableRow = "<tr id=" + expenses.length + "><td>" + description + "</td><td>" + amount + "</td><td>" + date + "</td><td>"+"<button class='delete' type='button' onclick='deleteExpense(event)'><i class='fas fa-trash'></i></button>"+"</td><td>"+"<button class='edit' type='button' onclick='editExpense(event)'><i class='fa-regular fa-pen-to-square'></i></button>"+"</td></tr>";
        expenses.push(expense);
        $("table tbody").append(tableRow); //appending tablerow data to tbody inside the table
        //to clear the text fileds 
        $("#text").val("");
        $("#rs").val("");
        $("#date").val("");
        $(".amount-error").html(amountWarning).hide(); //fadeOut();
        $(".date-error").html(dateWarning).hide(); //fadeOut();
        //calling the function to get the values from the table and to display the values(rs)
        calculations (expenses);
    }
};
function calculations (expenses) { //to get the values from the table and calculating each amount
    // var row = $("#table");//document.getElementById("table")
    let earnedAmount = 0;
    let spentAmount = 0;
    let leftAmount = 0;
    for(let i=0; i<expenses.length; i++) { //iterate on each table row(if i put i=0 it gets table heading we don't need heading so set i value to i=1)
        if(expenses[i].amount>0){ //(rs in rows[1]means first row) to get cells[1](rs) value//
            earnedAmount = earnedAmount+ parseFloat(expenses[i].amount); //here the parseInt method coverts value as a string and returns the first integer.
        }
        else if(expenses[i].amount<0) {
            spentAmount = spentAmount+ parseFloat(expenses[i].amount);
        }
    };
    leftAmount = (earnedAmount)-Math.abs(spentAmount);  
    //to set the label values(or we can use .html)
    $("#earnedrs").text(earnedAmount); 
    $("#spentrs").text(spentAmount);
    $("#totalleft").text(leftAmount);
}
function checkIfAnyValidationErrors(description, amount, date) {
    let validationError = false;
    let amountValidatiorRE = /^[+,-]?[1-9]\d*\.?\d*$|^[+,-]?[0]\.[1-9]*$/; //^ starts with,[0-9]means accept any no btw 0-9 (1,2..9), * 0 or more times and + means 1 time or above accept 10,200..//
    // $means ends with,? means optional accept + and without +//
    // let dateValidatorRE = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    // let dateValidatorRE = /^(?:[0][1-9])|(?:[1-2][0-9])\/(?:[0][1-9])|(?:[1][0-2])\/\d{4}$/;//|(?:[3][0-1])
    let dateValidatorRE = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
    $(".amount-error").html("");
    $(".date-error").html("");
    if((!description)||(!amount)||(!date)) {
        alert("please enter the details");
        validationError = true;
    }
    else {
        if(!amountValidatiorRE.test(amount)) { //test to verify the expression//
            $(".amount-error").html(amountWarning).show();//fadeIn();
            validationError = true;
        }
        else if(!dateValidatorRE.test(date)) { //test to verify the expression//
            $(".date-error").html(dateWarning).show();//fadeIn();
            validationError = true;
        }
    };
    return validationError;
}
//when click on delete button
function deleteExpense(eventObj) {  
    let targetObj = eventObj.target; //eventobject contains general info about an event like at what time the event happened and target tells what element generated the event.  
    let tableRowId = ($(targetObj).parent().parent().parent().attr("id")); // get the tablerowid
    expenses.splice(tableRowId,1);//deleting the expense from the model(expenses) by using the array splice method 
    $(targetObj).parent().parent().parent().remove(); //removeing the entire tablerow where the user clicked
    calculations(expenses); 
}
function editExpense(eventObj) {
    let targetObj = eventObj.target; // 
    let tableRowId = ($(targetObj).parent().parent().parent().attr("id")); // get the id
    let expenseRow = expenses[tableRowId]; // get the expense from the expenses (model)
    //targetobj is edit icon .parent is button .parent is td .parent is tr in that tr .find(td:eq(0))finds description
    $(targetObj).parent().parent().parent().find("td:eq(0)").html('<input name="edit-des" value="'+expenseRow.description+'">');
    $(targetObj).parent().parent().parent().find("td:eq(1)").html('<input name="edit-amount" value="'+expenseRow.amount+'">');
    $(targetObj).parent().parent().parent().find("td:eq(2)").html('<input name="edit-date" value="'+expenseRow.date+'">');
    let saveButton = $(targetObj).parent().parent().parent().find("td:eq(4)").prepend("<button class='save' type='button' onclick='saveExpense(event)'><i class='fas fa-save'></i></button>");
    $(".edit").hide();
    $(".save").show();

    // $(".edit").css("display","none");
    // $(".save").css("display","inline-block");
}
// user wants to save the editable row
// model: expenses = [
    // {description: "grocery 1", amount: 100, date: "11/11/1111"}
    // {description: "grocery 2", amount: 120, date: "12/11/1111"}
// ]
// view: expenses = [
    // {description: "grocery 1", amount: 100, date: "11/11/1111"}
    // {description: "grocery 2", amount: 120, date: "12/11/1111"}
// ]
// action: editbuttonclick on grocery 2
// model: expenses = [
    // {description: "grocery 1", amount: 100, date: "11/11/1111"}
    // {description: "grocery 2", amount: 120, date: "12/11/1111"}
// ]
// view: expenses = [
    // {description: "grocery 1", amount: 100, date: "11/11/1111"}
    // {description: "grocery 2", amount: 125, date: "13/11/1111"}
// ]
// action: savebuttonclick on grocery 2
function saveExpense(eventObj) {
    let targetObj = eventObj.target;
    // get the (particular row data) from the view and re-place it into the model
    let editedExpense = { 
        description: ($(targetObj).parent().parent().parent().find("td:eq(0)").find("input").val()),
        amount: ($(targetObj).parent().parent().parent().find("td:eq(1)").find("input").val()),
        date: ($(targetObj).parent().parent().parent().find("td:eq(2)").find("input").val())
    };
    if (!checkIfAnyValidationErrors(editedExpense.description, editedExpense.amount, editedExpense.date)) {
        expenses.splice($(targetObj).parent().parent().parent().attr("id"),1, editedExpense);
        //view:
        // remove the input tags
        // update the expenses
        $(targetObj).parent().parent().parent().find("td:eq(0)").html(editedExpense.description);
        $(targetObj).parent().parent().parent().find("td:eq(1)").html(editedExpense.amount);
        $(targetObj).parent().parent().parent().find("td:eq(2)").html(editedExpense.date);
        calculations(expenses);
    };
    $(".save").remove();
    $(".edit").show();
}
// problem 1: expenses array has one Expense object and one object??
// problem 2: row is still editable after clicking the save button. 
// model: expenses = [
    // {description: "grocery 1", amount: 100, date: "11/11/1111"}
    // {description: "grocery 2", amount: 125, date: "13/11/1111"}
// ]
// view: expenses = [
    // {description: "grocery", amount: 100, date: "11/11/1111"}
    // {description: "grocery 2", amount: 125, date: "13/11/1111"}
// ]

// model: expenses = [{description: "grocery,shopping", amount: 150, date: "11/11/1111"}]
// view: expenses = [{description: "grocery,shopping", amount: 150, date: "11/11/1111"}]
$(document).ready(function() {

    // function calculations (expenses) { //to get the values from the table and calculating each amount
    //     // var row = $("#table");//document.getElementById("table")
    //     let earnedAmount = 0;
    //     let spentAmount = 0;
    //     let leftAmount = 0;
    //     for(let i=0; i<expenses.length; i++) { //iterate on each table row(if i put i=0 it gets table heading we don't need heading so set i value to i=1)
    //         if(expenses[i].amount>0){ //(rs in rows[1]means first row) to get cells[1](rs) value//
    //             earnedAmount = earnedAmount+ parseFloat(expenses[i].amount); //here the parseInt method coverts value as a string and returns the first integer.
    //         }
    //         else if(expenses[i].amount<0) {
    //             spentAmount = spentAmount+ parseFloat(expenses[i].amount);
    //         }
    //     };
    //     leftAmount = (earnedAmount)-Math.abs(spentAmount);  
    //     //to set the label values(or we can use .html)
    //     $("#earnedrs").text(earnedAmount); 
    //     $("#spentrs").text(spentAmount);
    //     $("#totalleft").text(leftAmount);
    // }
});