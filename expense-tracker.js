$ (document).ready(function(){
    $("#submit").click(function() {
        let description = $("#text").val();
        let rs = $("#rs").val();
        let date = $("#date").val();
        let button = "<tr><td>"+"<button class='delete' type='button'><i class='fas fa-trash'></i></button>"+"</td></tr>";
        let tableRow = "<tr><td>" + description + "</td><td>" + rs + "</td><td>" + date + "</td><td>"+"<button class='delete' type='button'><i class='fas fa-trash'></i></button>"+"</td></tr>";
        $("table tbody").append(tableRow);
    });
});