import jwt from 'jsonwebtoken'
import {
    promisify
} from 'util'
import con from '../database/connection.js'

var session

export const login = async (req, res) => {
    const {
        username,
        password
    } = req.body
    // valida si los parametros estan completos
    if (!username || !password) {
        res.send('Debe enviar los datos completos')
        return;
    }

    // query a la base de datos para verificar que exista el profesor
    con.query('SELECT * FROM usuarios WHERE usuario = ? and contraseña = ?;', [username, password], async (err, result) => {
        // validar el error
        if (err) {
            console.log(`${err}`);
        }
        // crear el token usando el id del usuario
        const id = result[0].usuarioId
        const token = jwt.sign({
            id: id
        }, process.env.JWT_SECRET)

        // // guardar en la sesion el token generado

        session = req.session
        session.token = token
        session.usuario = result[0].usuarioId

        res.redirect('/')

    })


}

// elimina la cookie y cierra la sesion
export const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}
export const vusuario = (req, res, next) => {
    session = req.session
    console.log(session)
    if (session.usuario) {
        res.usuario = session.usuario
        next()
    } else {
        req.session.destroy()
        res.redirect('/login')
    }
}


// Creando un middleware para proteger las URL que necesitan inicio de sesion
export const isAuthenticated = async (req, res, next) => {
    if (req.session.token) {
        // validar que el token le pertenezca al usuario
        const verifyPromise = await promisify(jwt.verify)
        const decoded = await verifyPromise(req.session.token, process.env.JWT_SECRET)
        console.log(decoded)
        // decoded: {id: <id del user en base de datos>}
        const userID = decoded.id

        // consultar en la base de datos si el usuario que se decodificó del token, existe
        con.query('SELECT * FROM usuarios WHERE usuarioId = ?', [userID], (err, result) => {
            if (err) {
                return res.redirect('/login')
            } else {
                // el usuario existe
                session = req.session
                session.usuario = result[0].usuarioId
                next()
            }
        })
    } else {
        // el token no exite, por tanto, no se ha iniciado sesion
        return res.redirect('/login')
    }
}

// Creando un middleware que monitoree todas las peticiones
export const logger = (req, res, next) => {
    console.log(req.path, req.method)
    // console.log('La peticion ha sido interceptada y sigue su rumbo')
    next()
}