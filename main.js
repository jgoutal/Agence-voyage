let express = require('express')
let app = express()
let bodyParser = require('body-parser')
const Billet = require('./controllers/billet')
let PORT = 8080

app.set('view engine', 'ejs')

app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))

let router = require('./controllers/router')
app.use('/', router)

app.listen(PORT, () => {
    console.log(`Connected to ${PORT} `)
})