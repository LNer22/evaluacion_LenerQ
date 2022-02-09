/**
 * Función que ejecuta una petición al servidor para eliminar un cliente
 * @param {text} DNI Identificador del cliente
 */
function eliminarcliente(DNI) {
    $.ajax({
            url: '/cliente/eliminar',
            method: 'DELETE',
            async: false,
            cache: false,
            data: {
                DNI: DNI
            }
        })
        .done((respuesta) => {
            if (respuesta.type == 'success') {
                $("#fila-" + DNI).fadeOut("normal", function () {
                    $("#fila-" + DNI).remove()
                })
            }
        });
}