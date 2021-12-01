const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    let getVilles = require('../model/db').getVilles
    getVilles((Villes) => {
        res.render('./index', {Villes:Villes})
    })
})

router.post('/', (req, res) => {
    let getBillet = require('../model/db').getBillet
    let getVilles = require('../model/db').getVilles
    getVilles((Villes) => {
        if (req.body.villeArrive === undefined || req.body.villeArrive === "" || req.body.villeDepart === undefined || req.body.villeDepart === "" || req.body.date === undefined || req.body.date === "") {
            res.render("./index", {erreur: "Merci de rentrer toutes les valeurs.", Villes:Villes})
        } else {
        getBillet(req.body.villeDepart, req.body.villeArrive, req.body.date, (billets) => {
            if (billets.length === 0) {
                res.render("./index", {requete_vide: "Aucun trajet trouvé pour ces dates ou ces villes.", Villes:Villes})
            } else {
                res.render("./index", {billets_list:billets, Villes:Villes})
            }
        })
        }
    })
    
})

router.get('/billet/:id', (req, res) => {
    let getBilletbyId = require('../model/db').getBilletbyId
    getBilletbyId(req.params.id, (billet) => {
        let pretty_date = require('../util/date_manipulation').pretty_date
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

module.exports = router