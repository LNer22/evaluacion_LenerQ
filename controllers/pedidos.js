import cnn from "../database/connection.js"

/**
 * Renderiza la vista de pedidos y envía como parámetros la lista de pedidos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de pedidos con los datos, en caso de error, imprime el error en consola
 */
export const listarPed = async (req, res) => {
    cnn.query(`
    SELECT 
        p.pedidoId, 
        concat(c.clienteNombre,' ',c.clienteApellidos) as cliente,
        pedidoFecha,
        pedidoEstado
    FROM pedidos  p
    inner join clientes c on c.DNI = p.DNI
    WHERE pedidoActivo=1;`, (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('pedidos', {
            data: result
        })
    })

}

/**
 * Renderiza la vista de pedido, asignando una acción y la data necesaria para su funcionamiento
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de pedido con los datos, en caso de error, imprime el error en consola
 */
export const pedido = async (req, res) => {
    const {
        accion,
        pedidoId
    } = req.query
    let pedido = ''
    if (pedidoId && accion == 'detalle') {
        cnn.query(`
        SELECT
            *
        FROM pedidos p2 
        WHERE p2.pedidoId=${pedidoId};`, (err, ddetalle) => {
            console.log(ddetalle)
            if (!ddetalle[0].pedidoSupervisor) {
                cnn.query(`
                SELECT
                    p2.pedidoId, 
                    p2.pedidoFecha,
                    p2.pedidoEstado,
                    p2.pedidoFechaAprobacion,
                    concat(u.usuarioNombre,' ',u.usuarioApellidos) as usuarioNombreCompleto, 
                    concat(c.clienteNombre,' ',c.clienteApellidos) as clienteNombreCompleto,
                    p.productoNombre,
                    d.cantidad,
                    p.productoPrecio, 
                    (d.cantidad*p.productoPrecio) as subtotal
                FROM pedidos p2 
                inner join usuarios u on p2.pedidoVendedor = u.usuarioId 
                inner join clientes c on c.DNI = p2.DNI
                inner join detallepedidos d on d.pedidoId = p2.pedidoId 
                inner join productos p on p.productoId = d.productoId 
                WHERE p2.pedidoId=${pedidoId};`, (err, ddetalle) => {
                    res.render('vpedido', {
                        accion: accion,
                        detalle: ddetalle,
                        pedidoId

                    })
                    return
                })

            } else {
                cnn.query(`
                SELECT
                    p2.pedidoId, 
                    p2.pedidoFecha,
                    p2.pedidoEstado,
                    p2.pedidoFechaAprobacion,
                    concat(u2.usuarioNombre,' ',u2.usuarioApellidos) as usuarioSupervisor, 
                    concat(u.usuarioNombre,' ',u.usuarioApellidos) as usuarioNombreCompleto, 
                    concat(c.clienteNombre,' ',c.clienteApellidos) as clienteNombreCompleto,
                    p.productoNombre,
                    p2.pedidoFechaAprobacion,
                    d.cantidad,
                    p.productoPrecio, 
                    (d.cantidad*p.productoPrecio) as subtotal
                FROM pedidos p2 
                inner join usuarios u on p2.pedidoVendedor = u.usuarioId 
                inner join usuarios u2 on p2.pedidoSupervisor = u2.usuarioId
                inner join clientes c on c.DNI = p2.DNI
                inner join detallepedidos d on d.pedidoId = p2.pedidoId 
                inner join productos p on p.productoId = d.productoId 
                WHERE p2.pedidoId=${pedidoId};`, (err, ddetalle) => {
                    res.render('vpedido', {
                        accion: accion,
                        detalle: ddetalle,
                        pedidoId

                    })
                    return
                })
            }
        })
    } else if (pedidoId && accion == 'confirmar') {
        cnn.query(`
        SELECT
            p2.pedidoId, 
            p2.pedidoFecha,
            p2.pedidoEstado,
            p2.pedidoFechaAprobacion,
            concat(u.usuarioNombre,' ',u.usuarioApellidos) as usuarioNombreCompleto, 
            concat(c.clienteNombre,' ',c.clienteApellidos) as clienteNombreCompleto,
            p.productoNombre,
            d.cantidad,
            p.productoPrecio, 
            (d.cantidad*p.productoPrecio) as subtotal
        FROM pedidos p2 
        inner join usuarios u on p2.pedidoVendedor = u.usuarioId 
        inner join clientes c on c.DNI = p2.DNI
        inner join detallepedidos d on d.pedidoId = p2.pedidoId 
        inner join productos p on p.productoId = d.productoId 
        WHERE p2.pedidoId=${pedidoId};`, (err, ddetalle) => {
            res.render('apedido', {
                accion: accion,
                detalle: ddetalle,
                vendedor: res.usuario,
                pedidoId: pedidoId
            })
            return
        })

    } else if (accion) {
        cnn.query(`
        SELECT 
            *
        FROM clientes WHERE clienteActivo=1`, (err, result) => {
            cnn.query(`
            SELECT 
                *
            FROM productos WHERE productoActivo=1 and productoCantidad>0`, (err, prod) => {

                res.render('pedido', {
                    accion: accion,
                    data: result,
                    productos: prod,
                    vendedor: res.usuario
                })
                return
            })
        })
    } else {
        res.send("Acción no definida")
        return
    }

}

export const listarAprobados = async (req, res) => {
    const {
        fecha2,
        fecha1
    } = req.body
    if (!fecha2 || !fecha1) {
        res.send('Debe enviar los datos completos')
        return
    }

    cnn.query(`
        SELECT
        concat(u.usuarioNombre,' ',u.usuarioApellidos) as vendedor,
        p2.pedidoId,
        d.cantidad,
        p.productoNombre
        FROM pedidos p2 
        inner join usuarios u on p2.pedidoVendedor = u.usuarioId
        inner join detallepedidos d on d.pedidoId = p2.pedidoId 
        inner join productos p on p.productoId = d.productoId 
        WHERE (p2.pedidoFecha BETWEEN ${fecha1} AND ${fecha2});`, (err, ddetalle) => {
        if (!err) {
            res.setHeader("Content-Type", "application/json")
            res.statusCode = 200
            res.json({
                type: 'success'
            })
        }
    })
}

export const search = async (req, res) => {
    res.render('search')
}

/**
 * Almacena el pedido y redirecciona a la pantalla principal de pedidos
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna la vista de pedidos con los datos actualizados
 */
export const guardarpedido = async (req, res) => {
    const {
        DNI,
        pedidoFecha,
        pedidoVendedor,
        Productos,
        Cantidades
    } = req.body
    if (!DNI || !pedidoFecha || !pedidoVendedor) {
        console.log(DNI)
        console.log(pedidoFecha)
        console.log(pedidoVendedor)
        res.send("Debe enviar los datos completos")
        return
    }
    const data = {
        DNI,
        pedidoFecha,
        pedidoVendedor,
        pedidoActivo: 1,
        pedidoEstado: 'REGISTRADO'
    }
    cnn.query("INSERT INTO pedidos SET ?", [data], async (err, result) => {
        if (err) {
            res.send(err)
            return
        } else {
            Productos.forEach((element, index) => {
                cnn.query("INSERT INTO detallepedidos SET ?", [{
                    productoId: element,
                    cantidad: Cantidades[index],
                    pedidoId: result.insertId
                }], async (err, result) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                })
            });
            res.setHeader("Content-Type", "application/json")
            res.statusCode = 200
            res.json({
                type: 'success'
            })
            return
        }
    })
}

/**
 * 
 * Elimina el registro del pedido
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna una si la operación se realizó con éxito o no
 */
export const eliminarpedido = async (req, res) => {
    const {
        pedidoId
    } = req.body
    if (!pedidoId) {
        res.send("Debe enviar los datos completos")
        return
    }
    cnn.query("UPDATE pedidos SET pedidoActivo = 0 WHERE pedidoId=?", [pedidoId], async (err, result) => {
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

export const editarpedido = async (req, res) => {
    const {
        pedidoId,
        pedidoSupervisor
    } = req.body
    if (!pedidoId || !pedidoSupervisor) {
        res.send("Debe enviar los datos completos")
        return
    }
    let pedidoFechaAprobacion = new Date().toLocaleString("sv-SE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(" ", "T")
    cnn.query(`UPDATE pedidos SET pedidoSupervisor='${pedidoSupervisor}', pedidoFechaAprobacion='${pedidoFechaAprobacion}', pedidoEstado='APROBADO' WHERE pedidoId=${pedidoId};`, async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.redirect("/pedidos")
    })
}