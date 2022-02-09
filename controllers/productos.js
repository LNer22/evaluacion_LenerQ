import cnn from "../database/connection.js"

/**
 * Renderiza la vista de productos y envía como parámetros la lista de productos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de productos con los datos, en caso de error, imprime el error en consola
 */
export const listarP = async (req, res) => {
    cnn.query(`
        SELECT 
            productoId,
            productoNombre,
            productoDescripcion,
            productoCantidad,
            productoActivo,
            productoPrecio
        FROM productos WHERE productoActivo=1;`, (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('productos', {
            data: result
        })
    })

}

/**
 * Renderiza la vista de producto, asignando una acción y la data necesaria para su funcionamiento
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de producto con los datos, en caso de error, imprime el error en consola
 */
export const producto = async (req, res) => {
    const {
        accion,
        productoId
    } = req.query
    let producto = ''
    if (productoId && accion == 'editar') {
        cnn.query(`
        SELECT 
            productoId,
            productoNombre,
            productoDescripcion,
            productoCantidad,
            productoActivo,
            productoPrecio
        FROM productos WHERE productoId=${productoId};`, (err, result) => {
            res.render('producto', {
                accion: accion,
                data: result
            })
            return
        })
    } else if (accion) {
        res.render('producto', {
            accion: accion,
            data: producto,
            productoId: productoId
        })
        return
    } else {
        res.send("Acción no definida")
        return
    }

}

/**
 * Almacena el producto y redirecciona a la pantalla principal de productos
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna la vista de productos con los datos actualizados
 */
export const guardarproducto = async (req, res) => {
    const {
        productoNombre,
        productoCantidad,
        productoDescripcion,
        productoPrecio
    } = req.body
    if (!productoCantidad || !productoNombre) {
        res.send("Debe enviar los datos completos")
        return
    }
    const data = {
        productoNombre: productoNombre,
        productoCantidad: productoCantidad,
        productoDescripcion: productoDescripcion,
        productoActivo: 1,
        productoPrecio: productoPrecio
    }
    cnn.query("INSERT INTO productos SET ?", [data], async (err, result) => {
        if (err) {
            res.send(err)
            return
        } else {
            res.redirect("/productos")
        }
    })
}

/**
 * 
 * Elimina el registro del producto
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna una si la operación se realizó con éxito o no
 */
export const eliminarproducto = async (req, res) => {
    const {
        productoId
    } = req.body
    if (!productoId) {
        res.send("Debe enviar los datos completos")
        return
    }
    cnn.query("UPDATE productos SET productoActivo = 0 WHERE productoId=?", [productoId], async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 200
        res.json({
            type: 'success'
        })

    })
}

export const editarproducto = async (req, res) => {
    const {
        productoId,
        productoNombre,
        productoCantidad,
        productoDescripcion
    } = req.body
    if (!productoId || !productoNombre || !productoCantidad) {
        res.send("Debe enviar los datos completos")
        return
    }
    cnn.query(`UPDATE productos SET productoNombre='${productoNombre}', productoCantidad='${productoCantidad}', productoDescripcion='${productoDescripcion}' WHERE productoId=${productoId};`, async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.redirect("/productos")
    })
}