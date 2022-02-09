$(document).ready(function () {
    let subt = 0
    $("[id^='st-']").each(function () {
        subt += parseFloat($(this).text())
    })
    $("#totalPedido").html('L. '+subt)
});