import './loadEnv.js'
import express from 'express'
import morgan from 'morgan'
import router from './routes/index.js'
import session from "express-session"
import cookieParser from "cookie-parser"
import path from'path'
const __dirname = path.resolve()


// Puerto
const PORT = 7777

const app = express()
const oneDay = 24*60*60*1000

// Configuracion de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {maxAge: oneDay}
}))
app.use(cookieParser())

// Configuración básica
app.set('view engine','ejs')
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/', express.static(__dirname + '/public'));
app.use('/',router)

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})

