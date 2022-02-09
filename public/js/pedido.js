function eliminarpedido(pedidoId) {
    $.ajax({
            url: '/pedido/eliminar',
            method: 'DELETE',
            async: false,
            cache: false,
            data: {
                pedidoId: pedidoId
            }
        })
        .done((respuesta) => {
            if (respuesta.type == 'success') {
                $("#fila-" + pedidoId).fadeOut("normal", function () {
                    $("#fila-" + pedidoId).remove()
                })
            }
        });
}

function myFunction(inpt, tbl, pos) {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(inpt);
    filter = input.value.toUpperCase();
    table = document.getElementById(tbl);
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[pos];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}