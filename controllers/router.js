const { request } = require('express')
const express = require('express')
const router = express.Router()

router.get('/index', (req, res) => {
    let getVilles = require('../model/db').getVilles
    getVilles((Villes, error) => {
        if (error) {
            console.log(error)
            req.locals.erreur = "SQL Error: Not suppose to happend, please use the GUI."
            res.render('./index', {Villes:Villes})
        } else {
            if (req.session.erreur) {
                res.locals.erreur = req.session.erreur
                req.session.erreur = undefined
                res.render('./index', {Villes:Villes})
            } else {
                if (req.session.requete_vide) {
                    res.locals.requete_vide = req.session.requete_vide
                    req.session.requete_vide = undefined
                    res.render('./index', {Villes:Villes})
                } else {
                    if (req.session.billets_list) {
                        res.locals.billets_list=req.session.billets_list
                        req.session.billets_list=undefined
                        res.render("./index", {Villes:Villes})
                    } else {
                        res.render('./index', {Villes:Villes})
                    }
                }
            }
        }
    })
})

router.post('/index', (req, res) => {
    let getBillet = require('../model/db').getBillet
    if (req.body.villeArrive === undefined || req.body.villeArrive === "" || req.body.villeDepart === undefined || req.body.villeDepart === "" || req.body.date === undefined || req.body.date === "") {
        req.session.erreur = "Merci de rentrer toutes les valeurs."
        res.redirect('/index')
    } else {
    getBillet(req.body.villeDepart, req.body.villeArrive, req.body.date, (billets, error) => {
        if (error) {
            console.log(error)
            req.session.erreur = "SQL error: Not supposed to happend, please use the GUI."
            res.redirect('/index')
        } else {
            if (billets.length === 0) {
                req.session.requete_vide = "Aucun trajet trouvé pour ces dates ou ces villes."
                res.redirect('/index')
            } else {
                console.log("lol")
                req.session.billets_list = billets
                res.redirect('/index')
            }
        }
    })
    }
    
})

router.get('/index/billet/:id', (req, res) => {
    let getBilletbyId = require('../model/db').getBilletbyId
    getBilletbyId(req.params.id, (billet, error) => {
        if (error) {
            res.locals.erreur = "SQL Error: SQL error: Not supposed to happend, please use the GUI."
            res.redirect('/index')
        }
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

router.get('/signup', (req, res) => {
    if (req.session.error) {
        res.locals.error = req.session.error
        req.session.error = undefined
        res.render('./signup')
    } else {
        res.render('./signup')
    }
})

router.get('/login', (req, res) => {
    if (req.session.error) {
        res.locals.error = req.session.error
        req.session.error = undefined
        res.render('./login')
    } else {
        if (req.session.succes) {
            res.locals.succes = req.session.succes
            req.session.succes = undefined
            res.render('./login')
        } else {
            res.render('./login')
        }
    }
})

router.post('/login', (req, res) => {
    let bcrypt = require('bcrypt')
    let findClientByLogin = require('../model/db').findClientByLogin
    findClientByLogin(req.body.login, (result, error) => {
        if (error) {
            console.log(error)
            req.session.error = "SQL Error: Not suppose to happend, please use the GUI."
            res.redirect('/login')
        } else {
            if (!result[0]) {
                res.status(401)
                req.session.error = "L'utilisateur n'existe pas."
                res.redirect('/login')
            } else {
                bcrypt.compare(req.body.password, result[0].password).then(valid => {
                    if (!valid) {
                        res.status(401)
                        req.session.error = "Mot de passe incorrect."
                        res.redirect('/login')
                    } else {
                        let jwt = require('jsonwebtoken')
                        req.session.authorization = {
                            clientId:result[0].login,
                            token:jwt.sign(
                                {clientId:result[0].login},
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn:'24h'}
                            )
                        }
                        res.status(200)
                        res.redirect("/index")
                    }
                })
            }
        }
    })
})

router.post('/signup', (req, res) => {
    let bcrypt = require('bcrypt')
    if (req.body.prenom === undefined || req.body.prenom === "" || req.body.nom === undefined || req.body.nom === "" || req.body.login === undefined || req.body.login === "" || req.body.password === undefined || req.body.password === "") {
        req.session.error = "Merci de rentrer tous les champs."
        res.redirect('/signup')
    } else {
        bcrypt.hash(req.body.password, 10).then(hash=>{
            let createClient = require('../model/db').createClient
            createClient(req.body.prenom, req.body.nom, req.body.type, req.body.reduction, req.body.login, hash, (result, error) => {
                if (error) {
                    console.log(error)
                    req.session.error = "Login existant ou champs incorrect."
                    res.redirect('/signup')
                } else {
                    req.session.succes = "Votre compte est bien crée."
                    res.redirect('/login')
                }
            })
        })
    }
})

module.exports = router