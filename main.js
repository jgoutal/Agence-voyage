let express = require('express')
let app = express()
let bodyParser = require('body-parser')
const Billet = require('./controllers/billet')
let PORT = 8080

app.set('view engine', 'ejs')

app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res) => {
    let getVilles = require('./model/db').getVilles
    getVilles((Villes) => {
        res.render('./index', {Villes:Villes})
    })
})

app.post('/', (req, res) => {
    let getBillet = require('./model/db').getBillet
    let getVilles = require('./model/db').getVilles
    if (req.body.villeArrive === undefined || req.body.villeArrive === "" || req.body.villeDepart === undefined || req.body.villeDepart === "" || req.body.date === undefined || req.body.date === "") {
        res.render("./index", {erreur: "Merci de rentrer toutes les valeurs."})
    } else {
    getBillet(req.body.villeDepart, req.body.villeArrive, req.body.date, (billets) => {
        if (billets.length === 0) {
            getVilles((Villes) => {
                res.render("./index", {requete_vide: "Aucun trajet trouvé pour ces dates ou ces villes.", Villes:Villes})
            })
        } else {
            getVilles((Villes) => {
                res.render("./index", {billets_list:billets, Villes:Villes})
            })
        }
    })
    }
})

app.get('/billet/:id', (req, res) => {
    let getBilletbyId = require('./model/db').getBilletbyId
    getBilletbyId(req.params.id, (billet) => {
        let pretty_date = require('./util/date_manipulation').pretty_date
        billet = billet[0]
        res.render('./page_billet', {HeureDepart:billet.HeureDepart,
                                     HeureArrivee:billet.HeureArrivee,
                                     Prix:billet.Prix,
                                     Train:billet.Train,
                                     date:pretty_date(billet.DateDepart),
                                     Reduction:50,
                                     GareArrive:billet.GareDestination,
                                     GareDepart:billet.GareDepart,
                                     villeDepart:billet.VilleDepart,
                                     villeArrive:billet.VilleDestination,
                                     duree:billet.duree})
    })
})

app.listen(PORT, () => {
    console.log(`Connected to ${PORT} `)
})