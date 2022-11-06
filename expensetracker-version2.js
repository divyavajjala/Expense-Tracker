$ (document).ready(function() {
    let expenses = [];
    class Expense {  
        constructor(name, amount, date) { 
            this.name = name;
            this.amount = amount;
            this.date = date;
        }
    }
    $("#submit").click(function() {
        let description = $("#text").val(); //get the user entered description value ex:groceries//in js we write document.getElementById("text").value;
        let amount = $("#rs").val(); //get the user entered rs
        let date = $("#date").val(); //get the user entered date
        let amountValidatiorRE = /^[+,-]?[1-9]\d*\.?\d*$|^[+,-]?[0]\.[1-9]*$/; //^ starts with,[0-9]means accept any no btw 0-9 (1,2..9) and + means 1 time or above accept 10,200..//
        // $means ends with,? means optional accept + and without +//
        // let dateValidatorRE = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        // let dateValidatorRE = /^(?:[0][1-9])|(?:[1-2][0-9])\/(?:[0][1-9])|(?:[1][0-2])\/\d{4}$/;//|(?:[3][0-1])
        let dateValidatorRE = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
        let expense = new Expense(description,amount,date);
        let a = expenses.push(expense);
        let error = $(".amount-error").html("");
        let error2 = $(".date-error").html("");
        let amountWarning = "please enter valid amount";
        let dateWarning = "please enter valid date";
        if((!description)||(!amount)||(!date)) {
            alert("please enter the details");
        }
        else {
            if(!amountValidatiorRE.test(amount)) { //test to verify the expression//
                $(".amount-error").html(amountWarning).show().fadeIn();
            }
            else if(!dateValidatorRE.test(date)) { //test to verify the expression//
                $(".date-error").html(dateWarning).show().fadeIn();
            }
            else {
            //setting the table row with user entered values
                let tableRow = "<tr id=" + expenses.length + "><td>" + description + "</td><td>" + amount + "</td><td>" + date + "</td><td>"+"<button class='delete' type='button'><i class='fas fa-trash'></i></button>"+"</td><td>"+"<button class='edit' type='button'><i class='fa-regular fa-pen-to-square'></i></button>"+"</td><td>"+"<button class='save' type='button'><i class='fas fa-save'></i></button>"+"</td></tr>";
                $("table tbody").append(tableRow); //appending tablerow data to tbody inside the table
                //to clear the text fileds 
                $("#text").val(""); 
                $("#rs").val("");
                $("#date").val("");
                $(".amount-error").html(amountWarning).hide().fadeOut();
                $(".date-error").html(dateWarning).hide().fadeOut();
                //calling the function to get the values from the table and to display the values(rs)
                calculations (expenses);
                //when click on delete button 
                
                
                
            };
        };
    });
    $(".delete").click(function(){ 
        $(this).parent().parent().remove(); //this means delete button in specific row, <tr>is the parent of <td> and <td> is parent of delete button. remove to tablerow.
        calculations(expenses);
        // $(this).parent().parent().remove(calculations(expenses)); //calling the function to delete the specific row and calculations of that row.
    });
    $(".edit").click(function() {
        // get the expense from the model
        // 
        let editDes = $(this).parent().parent().attr(description);//attr is used to specify the name of the attribute.//
        let editVal = $(this).parent().parent().attr(amount);
        let editDate = $(this).parent().parent().attr(date);
        //find method returns descendant elements of the selected element//
        $(this).parent().parent().find("td:eq(0)").html('<input name="edit-des" value="'+description+'">'); //eq method reduces the set of elements to the one with a specific index.//
        $(this).parent().parent().find("td:eq(1)").html('<input name="edit-rs" value="'+amount+'">');
        $(this).parent().parent().find("td:eq(2)").html('<input name="edit-date" value="'+date+'">');
        
    });
    $(".update").click(function(){
        let updateDes = $(this).parent().parent().find($("#text").val());
        let updateAmount = $(this).parent().parent().find($("#rs").val());
        let updateDate = $(this).parent().parent().find($("#date").val());
        $(this).parent().parent().find("td:eq(0)").text(updateDes);
        $(this).parent().parent().find("td:eq(0)").text(updateAmount);
        $(this).parent().parent().find("td:eq(0)").text(updateDate);
        $(this).parent().parent().attr('description', description);
        $(this).parent().parent().attr('description', description);
        $(this).parent().parent().attr('description', description);
    });
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
});