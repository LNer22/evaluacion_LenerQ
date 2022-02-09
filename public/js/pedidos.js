var i = 1;
$("#add1").click(function () {
    i++;
    $('#dynamic_field').append(
        `<tr id='row${i}'>
        <td id="select-${i}">
        </td>
        <td><input type="number" id="b-${i}" class="form-control" required /></td>
        <td>
        <td><button type="button" id="${i}" class="btn btn-success btn_remove">-</button></td>
        </td>
    </tr>
    
    `
    );
    $("#a-1").clone().appendTo(`#select-${i}`)
})

$(document).on('click', '.btn_remove', function () {
    var button_id = $(this).attr("id");
    $('#row' + button_id + '').remove();
})

$(document).on('input', "[id^='b-']", function () {
    var val = $(this).val();
    $(this).val(val.replace(/\D|\-/, ''));
});

$(document).ready(function () {
    $("#pedidoFecha").val(new Date().toLocaleString("sv-SE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(" ", "T"))


    $("#frm-pedido").submit(function (event) {
        event.preventDefault();
        let Productos = []
        let Cantidades = []
        $("[id^='a-']").each(function () {
            Productos.push($(this).val())
        })
        $("[id^='b-']").each(function () {
            Cantidades.push($(this).val())
        })
        let frm_data = {
            DNI: $("#DNI").val(),
            pedidoFecha: $("#pedidoFecha").val(),
            pedidoVendedor: $("#pedidoVendedor").val(),
            Productos: Productos,
            Cantidades: Cantidades
        }
        $.ajax({
                url: '/pedido/guardar',
                method: 'POST',
                async: false,
                cache: false,
                data: frm_data
            })
            .done((respuesta) => {
                if (respuesta.type == 'success') {
                    window.location = "/pedidos"
                }
            });


    });
});