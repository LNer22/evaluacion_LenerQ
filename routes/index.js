import express from 'express'
import { isAuthenticated, login, logout, vusuario } from '../controllers/authLogin.js'
import { cliente, editarcliente, eliminarcliente, guardarcliente, listarC } from '../controllers/clientes.js'
import { editarpedido, eliminarpedido, guardarpedido, listarAprobados, listarPed, pedido, search } from '../controllers/pedidos.js'
import { editarproducto, eliminarproducto, guardarproducto, listarP, producto } from '../controllers/productos.js'
const router = express.Router()

//Rutas de productos
router.get('/productos',isAuthenticated,listarP)
router.get('/producto',isAuthenticated,producto)
router.post('/producto/guardar',guardarproducto)
router.post('/producto/editar',editarproducto)
router.delete('/producto/eliminar',eliminarproducto)

// Rutas de clientes
router.get('/clientes',isAuthenticated,listarC)
router.get('/cliente',isAuthenticated,cliente)
router.post('/cliente/guardar',guardarcliente)
router.post('/cliente/editar',editarcliente)
router.delete('/cliente/eliminar',eliminarcliente)

// Ruta principal
router.get('/', isAuthenticated, listarPed)

// Ruta de login
router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/login', login)
router.get('/logout', logout)

// Rutas de pedidos
router.get('/pedidos',isAuthenticated ,listarPed)
router.post('/aprobados', listarAprobados)
router.get('/search', isAuthenticated,search)
router.get('/pedido', isAuthenticated,vusuario,pedido)
router.post('/pedido/guardar', vusuario,guardarpedido)
router.delete('/pedido/eliminar',eliminarpedido)
router.post('/pedido/actualizar',editarpedido)




export default router