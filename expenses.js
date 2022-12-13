
// function signInForm() {
//     $(".popupWindow").removeClass('hide'); //here we are removing hide class//
//     // $(".expensesheet").hide();
// }
// function closeSignInWindow() {
//     $(".popupWindow").addClass('hide'); //here adding hide class//
//     // $(".popupWindow").hide();
// }
// function signUpForm() {
//     $(".signupPage").removeClass('hide');
// }
// function closeSignUpWindow() {
//     $(".signupPage").addClass('hide');
// }
// let userWarning = "please enter valid username";
// let passwordWarning = "please enter valid password";
// let username = $(".user").val(); 
// let password = $(".password").val(); 
// function login() {
    // do basic field validations
    // if the validations failed
        //  show the corresponding errors

    // read the username and password fields
    // validate the username/password pair with the backend
    // if the validation succeeded
    // if(!checkIfAnyLoginErrors(username,password)) {
// if((!username)||(!password)) {
//     alert("please enter the details");
// }
// else {
//     $(".popupWindow").hide();
//     // else show the validation errors
//     $(".expensesheet").show();
// }
    
// }

// function checkIfAnyLoginErrors(username, password) {
//     let validationError = false;
    // let usernameValidatiorRE = /^[a-z]?[1-9]\d?.[a-z]*$/; //^ starts with,[0-9]means accept any no btw 0-9 (1,2..9), * 0 or more times and + means 1 time or above accept 10,200..//
    // $means ends with,? means optional accept + and without +//
    // let dateValidatorRE = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    // let dateValidatorRE = /^(?:[0][1-9])|(?:[1-2][0-9])\/(?:[0][1-9])|(?:[1][0-2])\/\d{4}$/;//|(?:[3][0-1])
    // let passwordValidatorRE = /^[abc]?[1-9]?[$/;
    // $(".user-error").html("");
    // $(".password-error").html("");
    // if((!username)||(!password)) {
    //     alert("please enter the details");
    //     validationError = true;
    // }
    // else {
    //     if(!usernameValidatiorRE.test(username)) { //test to verify the expression//
    //         $(".user-error").html(userWarning).show();//fadeIn();
    //         validationError = true;
    //     }
        // else if(!dateValidatorRE.test(date)) { //test to verify the expression//
        //     $(".date-error").html(dateWarning).show();//fadeIn();
        //     validationError = true;
        // }
    // };
//     return validationError;
// }
// import { onValue } from 'firebase/database';
const dbRef = firebase.database().ref();
const expensesRef = dbRef.child('demo');

$(document).ready(function() {
    getAllExpenses();
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

    $("#submit").click(() => submitExpense());
    
    function submitExpense() {
        $("table tbody tr").remove();
        $("table tbody td").remove();
        let description = $("#text").val(); //get the user entered description value ex:groceries//in js we write document.getElementById("text").value;
        let amount = $("#rs").val(); //get the user entered rs
        let date = $("#date").val(); //get the user entered date
        if (!checkIfAnyValidationErrors(description, amount, date)) {
            // validations succeeded
            let newExpense = new Expense(description, amount, date);
            saveExpenseToDB(expenseId, newExpense);
            //calling the function to get the values from the table and to display the values(rs)
            
            //to clear the text fileds 
            $("#text").val("");
            $("#rs").val("");
            $("#date").val("");
            $(".amount-error").html(amountWarning).hide(); //fadeOut();
            $(".date-error").html(dateWarning).hide(); //fadeOut();
        }
    };
    
    function showExpenses() {
        //setting the table row with user entered values
        for(let i=0; i<expenses.length; i++) {
            let id = i;
            let description = expenses[i].description;
            let amount = expenses[i].amount;
            let date = expenses[i].date;
            let tableRow = `
                <tr id="${id}">
                    <td>${description}</td>
                    <td>${amount}</td>
                    <td>${date}</td>
                    <td>
                        <button class='delete' type='button'><i class='fas fa-trash'></i></button>
                    </td>
                    <td>
                        <button class='edit' type='button'><i class='fa-regular fa-pen-to-square'></i></button>
                    </td>
                </tr>`;
            $("table tbody").append(tableRow); //appending tablerow data to tbody inside the table
        }
        $(".edit").click((eventObj) => editExpense(eventObj));
        $(".delete").click((eventObj) => deleteExpense(eventObj));
    }

    function saveExpenseToDB(id, expense) {
        let newExpense = {
            // expenseId: id,
            description: expense.description ,
            amount: expense.amount,
            date: expense.date
        }; 
        expensesRef.push(newExpense, function () {
            console.log("data has been inserted");
            getAllExpenses();
        });
    }

    function getAllExpenses() {
        expensesRef.once('value', (expensesList) => {
            console.log("data has been retrived ");
            expenses = [];
            expensesList.forEach((expense) => {
                let expenseObjectFromDB = expense.val();
                let expenseItem = new Expense(expenseObjectFromDB.description, expenseObjectFromDB.amount, expenseObjectFromDB.date);
                expenses.push(expenseItem);
            });
            showExpenses();
            calculations(expenses);
        });
        
    }
    
    function updateExpenseInDB(description,amount,date) {
        var updateExpense = {
            description: description,
            amount: amount,
            date: date
          };
        console.log(expensesRef.orderByChild('amount').equalTo('123'));
        //  Get a key for a new Post.
        // let newPostKey = expensesRef.push().key;
        // Write the new post's data simultaneously in the posts list and the user's post list.
        // let updates = {};
        // updates['/demo/' + updateExpense.description+newPostKey] = updateExpense;
        // updates['/demo/' + updateExpense.amount+newPostKey] = updateExpense;
        // updates['/demo/' + updateExpense.date+newPostKey] = updateExpense;
        // updates['/demo/' + updateExpense.amount + '/' + newPostKey] = updateExpense;

        return dbRef.update(updates);
    };

    function calculations (expenses) { //to get the values from the table and calculating each amount
        // var row = $("#table");//document.getElementById("table")
        let earnedAmount = 0;
        let spentAmount = 0;
        let leftAmount = 0;
        for(let i=0; i<expenses.length; i++) { //iterate on each table row
            if(expenses[i].amount>0){ //(rs in rows[1]means first row) to get cells[1](rs) value//
                earnedAmount = earnedAmount+ parseFloat(expenses[i].amount); //here the parseInt method coverts value as a string and returns the first integer.
            }
            else if(expenses[i].amount<0) {
                spentAmount = spentAmount+ parseFloat(expenses[i].amount);
            }
        };
        leftAmount = (earnedAmount)-Math.abs(spentAmount);  
        //to set the label values(or we can use .html)
        $("#earnedrs").html(earnedAmount); 
        // $("#earnedrs").text(earnedAmount); 
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

    function deleteExpense(eventObj) {
        let targetObj = eventObj.target; //eventobject contains general info about an event like at what time the event happened and target tells what element generated the event.  
        let tableRowId = ($(targetObj).parent().parent().parent().attr("id")); // get the tablerowid
        // use delete method from the docs//
        
    }

    //when click on delete button
    // function deleteExpense_Old(eventObj) {  
    //     let targetObj = eventObj.target; //eventobject contains general info about an event like at what time the event happened and target tells what element generated the event.  
    //     let tableRowId = ($(targetObj).parent().parent().parent().attr("id")); // get the tablerowid
    //     expenses.splice(tableRowId,1);//deleting the expense from the model(expenses) by using the array splice method 
    //     $(targetObj).parent().parent().parent().remove(); //removeing the entire tablerow where the user clicked
    //     calculations(expenses); 
    // }

    function editExpense(eventObj) {
        let targetObj = eventObj.target; // 
        let tableRowId = ($(targetObj).parent().parent().parent().attr("id")); // get the id
        let expenseRow = expenses[tableRowId]; // get the expense from the expenses (model)
        //targetobj is edit icon .parent is button .parent is td .parent is tr in that tr .find(td:eq(0))finds description
        $(targetObj).parent().parent().parent().find("td:eq(0)").html('<input name="edit-des" value="'+expenseRow.description+'">');
        $(targetObj).parent().parent().parent().find("td:eq(1)").html('<input name="edit-amount" value="'+expenseRow.amount+'">');
        $(targetObj).parent().parent().parent().find("td:eq(2)").html('<input name="edit-date" value="'+expenseRow.date+'">');
        let saveButton = $(targetObj).parent().parent().parent().find("td:eq(4)").prepend("<button class='save' type='button'><i class='fas fa-save'></i></button>");
        
        $(".edit").hide();
        $(".save").show();

        // $(".edit").css("display","none");
        // $(".save").css("display","inline-block");
        $(".save").click((eventObj)=>saveExpense(eventObj));
    }

    function saveExpense(eventObj) {
        let targetObj = eventObj.target;
        
        // get the (particular row data) from the view and re-place it into the model
        let editedExpense = { 
            description: ($(targetObj).parent().parent().parent().find("td:eq(0)").find("input").val()),
            amount: ($(targetObj).parent().parent().parent().find("td:eq(1)").find("input").val()),
            date: ($(targetObj).parent().parent().parent().find("td:eq(2)").find("input").val())
        };
        if (!checkIfAnyValidationErrors(editedExpense.description, editedExpense.amount, editedExpense.date)) {
            updateExpenseInDB(editedExpense.description,editedExpense.amount,editedExpense.date);
            expenses.splice($(targetObj).parent().parent().parent().attr("id"),1, editedExpense);
            //view:
            // remove the input tags
            // update the expenses
            $(targetObj).parent().parent().parent().find("td:eq(0)").html(editedExpense.description);
            $(targetObj).parent().parent().parent().find("td:eq(1)").html(editedExpense.amount);
            $(targetObj).parent().parent().parent().find("td:eq(2)").html(editedExpense.date);
            calculations(expenses);
            $(".save").remove();
            $(".edit").show();
        };
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
    // function appendScript(src, callback) {
        // creates a <script> tag and append it to the page
        // this causes the script with given src to start loading and run when complete
//         let script = document.createElement('script');
//         script.src = src;
//         document.head.append(script);
//     }
//     appendScript('.\expense-tracker.js'); // 11:05:30
//     function callback() {
//         calculations(dfd, fda)
//     // 11:05:32
//     setTimeout(() => { // 11:5:35
//         calculations(dfd, fda)
//     }, 5000)
});
//