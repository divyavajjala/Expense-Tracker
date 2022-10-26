$ (document).ready(function(){
    $("#submit").click(function() { //click on submit button// 
        let description = $("#text").val(); //get the user entered description value ex:groceries//in js we write document.getElementById("text").value;
        let rs = $("#rs").val(); //get the user entered rs
        let date = $("#date").val(); //get the user entered date
        if()
        //to user must enter all details
        if((!description)||(!rs)||(!date)){
            alert("please enter the details");
        }
        else{
            //setting the table row with user entered values
            let tableRow = "<tr><td>" + description + "</td><td>" + rs + "</td><td>" + date + "</td><td>"+"<button class='delete' type='button'><i class='fas fa-trash'></i></button>"+"</td></tr>";
            $("table tbody").append(tableRow); //appending tablerow data to tbody inside the table
            //to clear the text fileds 
            $("#text").val(""); 
            $("#rs").val("");
            $("#date").val("");
            //calling the function to get the values from the table and to display the values(rs)
            calculations ();
            //when click on delete button 
            $(".delete").click(function(){ 
                $(this).parent().parent().remove(); //this means delete button in specific row, <tr>is the parent of <td> and <td> is parent of delete button. remove to tablerow.
                calculations (); //calling the function to delete the specific row and calculations of that row.
            });
        };
    });
    function calculations () { //to get the values from the table and calculating each amount
        var row = $("#table");//document.getElementById("table")
        let earnedAmount = 0;
        let spentAmount = 0;
        let leftAmount = 0;
        for(let i=1; i<table.rows.length; i++) { //iterate on each table row(if i put i=0 it gets table heading we don't need heading so set i value to i=1)
            if(table.rows[i].cells[1].innerHTML>0){ //(rs in rows[1]means first row) to get cells[1](rs) value//
                earnedAmount = earnedAmount+ parseInt(table.rows[i].cells[1].innerHTML); //here the parseInt method coverts value as a string and returns the first integer.
            }
            else if(table.rows[i].cells[1].innerHTML<0) {
                spentAmount = spentAmount+ parseInt(table.rows[i].cells[1].innerHTML);
            }
        };
        leftAmount = (earnedAmount)-Math.abs(spentAmount);  
        //to set the label values(or we can use .html)
        $("#earnedrs").text(earnedAmount); 
        $("#spentrs").text(spentAmount);
        $("#totalleft").text(leftAmount);
    }
});
