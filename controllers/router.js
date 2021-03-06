const { request } = require('express')
const express = require('express')
const router = express.Router()

router.get('/index', (req, res) => {
    /*
    Renvoie la page de garde.
    -Si le client n'est pas connecté, redirige vers la page login
    -S'il y a des erreurs elle les affiche
    -Sinon renvoie la liste des billets (ou rien)
    */ 
    let getVilles = require('../model/db').getVilles
    let findClientByLogin = require('../model/db').findClientByLogin
    findClientByLogin(req.session.currentclient, (client, error) => {
        if (error) {
            console.log(error)
            res.redirect('/login')
        } else {
            res.locals.currentclient = client[0]
            getVilles((Villes, error) => {
                if (error) {
                    console.log(error)
                    res.locals.error = "SQL Error: Not suppose to happend, please use the GUI."
                } else {
                    if (req.session.error) {
                        res.locals.error = req.session.error
                        req.session.error = undefined
                    } else {
                        if (req.session.requete_vide) {
                            res.locals.requete_vide = req.session.requete_vide
                            req.session.requete_vide = undefined
                        } else {
                            if (req.session.succes_reservation) {
                                res.locals.succes_reservation = req.session.succes_reservation
                                req.session.succes_reservation = undefined
                            } else {
                                if (req.session.billets_list) {
                                    res.locals.billets_list=req.session.billets_list
                                    req.session.billets_list=undefined
                                }
                            }
                        }
                    }
                }
                res.render('./index', {Villes:Villes})
            })
        }
    })
})

router.post('/index', (req, res) => {
    /*
        Requete post redirige vers la page de base avec la liste des billets en variables
    */
    let getBillet = require('../model/db').getBillet
    if (req.body.villeArrive === undefined || req.body.villeArrive === "" || req.body.villeDepart === undefined || req.body.villeDepart === "" || req.body.date === undefined || req.body.date === "") {
        req.session.error = "Merci de rentrer toutes les valeurs."
        res.redirect('/index')
    } else {
    getBillet(req.body.villeDepart, req.body.villeArrive, req.body.date, (billets, error) => {
        if (error) {
            console.log(error)
            req.session.error = "SQL error: Not supposed to happend, please use the GUI."
            res.redirect('/index')
        } else {
            if (billets.length === 0) {
                req.session.requete_vide = "Aucun trajet trouvé pour ces dates ou ces villes."
                res.redirect('/index')
            } else {
                req.session.billets_list = billets
                res.redirect('/index')
            }
        }
    })
    }
    
})

router.get('/index/billet/:id', (req, res) => {
    // Retourne la page du billet, page qui permet de valider la reservation
    let getBilletbyId = require('../model/db').getBilletbyId
    let findClientByLogin = require('../model/db').findClientByLogin
    findClientByLogin(req.session.currentclient, (client, error) => {
        if (error) {
            console.log(error)
            res.redirect('/login')
        } else {
            res.locals.currentclient = client[0]
            getBilletbyId(req.params.id, (billet, error) => {
                if (error) {
                    res.locals.error = "SQL Error: SQL error: Not supposed to happend, please use the GUI."
                    res.redirect('/index')
                }
                let pretty_date = require('../util/date_manipulation').pretty_date
                billet = billet[0]
                if (req.session.error) {
                    res.locals.error = req.session.error
                    req.session.error = undefined
                } 
                let getNumerosVoiture = require('../model/db').getNumerosVoiture
                getNumerosVoiture(req.params.id, (numerosVoiture, error) => {
                    if (error) {
                        console.log(error)
                        res.locals.error = error
                        res.redirect('/index')
                    } else {
                        res.locals.numerosVoiture = numerosVoiture
                        res.render('./page_billet', {HeureDepart:billet.HeureDepart,
                            HeureArrivee:billet.HeureArrivee,
                            Prix:billet.Prix,
                            Train:billet.Train,
                            date:pretty_date(billet.DateDepart),
                            GareArrive:billet.GareDestination,
                            GareDepart:billet.GareDepart,
                            villeDepart:billet.VilleDepart,
                            villeArrive:billet.VilleDestination,
                            duree:billet.Duree,
                            idBillet:req.params.id})
                    }
                })
            })
        }
    })
})

router.get('/signup', (req, res) => {
    // Retourne la page d'inscription
    if (req.session.error) {
        res.locals.error = req.session.error
        req.session.error = undefined
        res.render('./signup')
    } else {
        res.render('./signup')
    }
})

router.get('/login', (req, res) => {
    // retourne la page d'indentification
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
    // Methode POST de tentative de connection
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
    // Methode POST de tentative d'inscription
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

router.get('/disconnect', (req, res) => {
    // Supprime toutes les variables de session permettant d'indentifier le client
    req.session.authorization = undefined
    req.session.currentclient = undefined
    res.redirect('/login')
})

router.post('/index/reservation', (req, res) => {
    // Methode POST, valide la reservation
    let findClientByLogin = require('../model/db').findClientByLogin
    findClientByLogin(req.session.currentclient, (client, error) => {
        if (error) {
            console.log(error)
            res.redirect('./login')
        } else {
            let makeReservation = require('../model/db').makeReservation
            makeReservation(client[0].login, req.body.idBillet, req.body.numeroVoiture, req.body.numeroPlace, (result, error) => {
                if (error) {
                    console.log(error)
                    req.session.error = "Place déjà prise."
                    res.redirect('/index/billet/'+req.body.idBillet)
                } else {
                    req.session.succes_reservation = "Billet réservé."
                    res.redirect('/index')
                }
            })
        }
    })
})

router.get('/index/mesreservations', (req, res) => {
    // Retourne la page contenant toutes les reservations d'un client
    let findClientByLogin = require('../model/db').findClientByLogin
    findClientByLogin(req.session.currentclient, (client, error) => {
        if (error) {
            console.log(error)
            res.redirect('/login')
        } else {
            res.locals.currentclient = client[0]
            let findReservationsByLogin = require('../model/db').findReservationsByLogin
            findReservationsByLogin(client[0].login, (reservations, error) => {
                if (error) {
                    console.log(error)
                    req.session.error = 'SQL Error: Not supposed to happend, please use the GUI.'
                    res.redirect('/index')
                } else {
                    if (reservations.length === 0) {
                        res.locals.no_reservation = "Vous n'avez aucune réservation."
                    } else {
                        let pretty_date = require('../util/date_manipulation').pretty_date
                        res.locals.reservations = reservations
                        res.locals.pretty_date = pretty_date
                    }
                    res.render('./mes-reservations')
                }
            })
        }
    })
})

router.get('/index/getplace', (req, res) => {
    // Retourne un texte avec toutes les places disponibles pour une voiture donnée, sert à une reponse AJAX
    let findClientByLogin = require('../model/db').findClientByLogin
    findClientByLogin(req.session.currentclient, (client, error) => {
        if (error) {
            console.log(error)
            res.redirect('/index')
        } else {
            let getNumerosPlace = require('../model/db').getNumerosPlace
            getNumerosPlace(req.query.idBillet, req.query.num, (numPlace, err) => {
                if (err) {
                    console.log(err)
                    res.redirect('/index')
                } else {
                    res.send(numPlace)
                }
            })
        }
    })
})

module.exports = router