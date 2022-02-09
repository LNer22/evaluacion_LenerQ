/**
 * Función que ejecuta una petición al servidor para eliminar un producto
 * @param {text} productoId Identificador del producto
 */
function eliminarproducto(productoId, DNI) {
    $.ajax({
            url: '/producto/eliminar',
            method: 'DELETE',
            async: false,
            cache: false,
            data: {
                productoId: productoId
            }
        })
        .done((respuesta) => {
            if (respuesta.type == 'success') {
                $("#fila-" + productoId).fadeOut("normal", function () {
                    $("#fila-" + productoId).remove()
                })
            }
        });
}