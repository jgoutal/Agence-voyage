let connection = require("../config/db-config")
let Billet = require("../controllers/billet")

let getBillet = (VilleDepart, VilleDestination, date, cb) => {
    connection.query('SELECT B.HeureDepart, B.HeureArrivee, B.Prix, B.Train, B.VilleDestination, B.VilleDepart, G1.Name GareDepart, G2.Name GareDestination, TIMEDIFF(TIMESTAMP(B.DateArrivee,B.HeureArrivee),TIMESTAMP(B.DateDepart,B.HeureDepart)) Duree FROM Billet B, Gares G1, Gares G2 WHERE VilleDepart=? AND VilleDestination=? AND DateDepart=? AND G1.id = B.GareDepart AND G2.id = B.GareArrivee', [VilleDepart, VilleDestination, date], (err, res, _field) => {
        if (err) throw err
        cb(res)
    })
}

module.exports = getBillet