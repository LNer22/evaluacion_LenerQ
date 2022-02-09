$(document).ready(function () {
    $("#btn-search").click(function () {

        let f1 = $("#fecha1").val().replace("T", " ")
        let f2 = $("#fecha2").val().replace("T", " ")

        var url = 'https:192.168.90.3:7777/aprobados';
        var data = {
            fecha1: f1,
            fecha2: f2
        };

        

    })
});