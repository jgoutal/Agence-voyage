let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')
let PORT = 8080

//editeur de vues
app.set('view engine', 'ejs')

//middleware
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({
    secret: 'lolilolilol',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

//middleware de redirection si non connecte
let authentification = require('./model/middleware').authentification
app.use('/index', authentification)

//import des routers
let router = require('./controllers/router')
app.use('/', router)

//middleware redirige les requetes vers la racine
app.use('/', (req, res, next) => {
    res.redirect('/index')
})

//on ecoute les requetes sur PORT
app.listen(PORT, () => {
    console.log(`Connected to ${PORT} `)
})