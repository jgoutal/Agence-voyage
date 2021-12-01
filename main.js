let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let PORT = 8080

app.set('view engine', 'ejs')

app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res) => {
    res.render('./index')
})

app.post('/', (req, res) => {
    let getBillet = require('./model/billet-model')
    if (req.body.villeArrive === undefined || req.body.villeArrive === "" || req.body.villeDepart === undefined || req.body.villeDepart === "" || req.body.date === undefined || req.body.date === "") {
        res.render("./index", {erreur: "Merci de rentrer toutes les valeurs."})
    } else {
    getBillet(req.body.villeDepart, req.body.villeArrive, req.body.date, (billets) => {
        if (billets.length === 0) {
            res.render("./index", {requete_vide: "Aucun trajet trouvé pour ces dates ou ces villes."})
        } else {
            res.render("./index", {billets_list:billets})
        }
    })
    }
})

app.get('/billet/:id', (req, res) => {
    res.render('./page_billet')
})

app.listen(PORT, () => {
    console.log(`Connected to ${PORT} `)
})