let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')
const Billet = require('./controllers/billet')
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

app.use((req, res, next) => {
    console.log(req.method)
    next()
})

//import des routers
let router = require('./controllers/router')
app.use('/', router)

//on ecoute les requetes sur PORT
app.listen(PORT, () => {
    console.log(`Connected to ${PORT} `)
})