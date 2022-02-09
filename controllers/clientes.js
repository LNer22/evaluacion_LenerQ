import cnn from "../database/connection.js"

/**
 * Renderiza la vista de clientes y envía como parámetros la lista de clientes registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de clientes con los datos, en caso de error, imprime el error en consola
 */
export const listarC = async (req, res) => {
    cnn.query(`
        SELECT 
            DNI, 
            clienteNombre, 
            clienteApellidos, 
            clienteDireccion, 
            clienteTelefono, 
            clienteSexo, 
            clienteEmail
        FROM clientes WHERE clienteActivo=1;`, (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('clientes', { data: result })
    })

}

/**
 * Renderiza la vista de cliente, asignando una acción y la data necesaria para su funcionamiento
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de cliente con los datos, en caso de error, imprime el error en consola
 */
export const cliente = async (req, res) => {
    const { accion, DNI } = req.query
    let cliente = ''
    if (DNI && accion == 'editar') {
        cnn.query(`
        SELECT 
            DNI, 
            clienteNombre, 
            clienteApellidos, 
            clienteDireccion, 
            clienteTelefono, 
            clienteSexo, 
            clienteEmail
        FROM clientes WHERE DNI=${DNI};`, (err, result) => {
            res.render('cliente', { accion: accion, data: result })
            return
        })
    } else if (accion) {
        res.render('cliente', { accion: accion, data: cliente, DNI:DNI })
        return
    } else {
        res.send("Acción no definida")
        return
    }

}

/**
 * Almacena el cliente y renderiza la pantalla principal de clientes
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna la vista de clientes con los datos actualizados
 */
export const guardarcliente = async (req, res) => {
    const {
        DNI,
        clienteNombre,
        clienteApellidos,
        clienteTelefono,
        clienteDireccion,
        clienteEmail,
        clienteSexo } = req.body
    if (!DNI || !clienteNombre || !clienteApellidos) {
        res.send("Debe enviar los datos completos")
        return
    }
    const data = {
        DNI: DNI,
        clienteNombre: clienteNombre,
        clienteApellidos: clienteApellidos,
        clienteDireccion: clienteDireccion,
        clienteTelefono: clienteTelefono,
        clienteSexo: clienteSexo,
        clienteEmail: clienteEmail,
        clienteActivo: 1
    }
    cnn.query("INSERT INTO clientes SET ?", [data], async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.redirect("/clientes")
    })
}

/**
 * 
 * Elimina el registro del cliente
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna una si la operación se realizó con éxito o no
 */
export const eliminarcliente = async (req, res) => {
    const { DNI } = req.body
    if (!DNI) {
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 501
        res.json({ type: 'error' })
        return
    }
    cnn.query("UPDATE clientes SET clienteActivo = 0 WHERE DNI=?", [DNI], async (err, result) => {
        if (err) {
            console.log(err)
            res.setHeader("Content-Type", "application/json")
            res.statusCode = 500
            res.json({ type: 'error' })
            return
        }
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 200
        res.json({ type: 'success' })

    })
}

export const editarcliente = async (req, res) => {
    const {
        DNI: DNI,
        clienteNombre: clienteNombre,
        clienteApellidos: clienteApellidos,
        clienteDireccion: clienteDireccion,
        clienteTelefono: clienteTelefono,
        clienteSexo: clienteSexo,
        clienteEmail: clienteEmail} = req.body
    if (!DNI || !clienteNombre || !clienteApellidos) {
        res.send("Debe enviar los datos completos")
        return
    }
    cnn.query(`UPDATE clientes SET clienteNombre='${clienteNombre}', clienteApellidos='${clienteApellidos}', clienteDireccion='${clienteDireccion}', clienteTelefono='${clienteTelefono}', clienteSexo='${clienteSexo}', clienteEmail='${clienteEmail}' WHERE DNI=${DNI};`, async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.redirect("/clientes")
    })
}