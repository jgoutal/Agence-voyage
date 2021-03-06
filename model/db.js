let connection = require("../config/db-config")

exports.getBillet = (VilleDepart, VilleDestination, date, cb) => {
    // Requete a la bdd, renvoie tous les billets entre deux villes a une date precise
    let query = 'SELECT B.idBillet, B.HeureDepart, B.HeureArrivee, B.Prix, B.Train, B.VilleDestination, '
    query +=    'B.VilleDepart, G1.Name GareDepart, G2.Name GareDestination, '
    query +=    'TIMEDIFF(TIMESTAMP(B.DateArrivee,B.HeureArrivee),TIMESTAMP(B.DateDepart,B.HeureDepart)) Duree '
    query +=    'FROM Billet B, Gares G1, Gares G2 '
    query +=    'WHERE VilleDepart=? '
    query +=    'AND VilleDestination=? '
    query +=    'AND DateDepart=? '
    query +=    'AND G1.id = B.GareDepart '
    query +=    'AND G2.id = B.GareArrivee '
    query +=    'ORDER BY B.HeureDepart'
    connection.query(query, [VilleDepart, VilleDestination, date], (err, res, _field) => {
        cb(res, err)
    })
}

exports.getBilletbyId = (idBillet, cb) => {
    // Renvoie le billet d'id = idBillet
    let query = 'SELECT B.HeureDepart, B.HeureArrivee, B.Prix, B.Train, B.VilleDestination, '
    query +=    'B.VilleDepart, G1.Name GareDepart, G2.Name GareDestination, '
    query +=    'DATE(B.DateDepart) DateDepart, '
    query +=    'TIMEDIFF(TIMESTAMP(B.DateArrivee,B.HeureArrivee),TIMESTAMP(B.DateDepart,B.HeureDepart)) Duree '
    query +=    'FROM Billet B, Gares G1, Gares G2 '
    query +=    'WHERE idBillet=? '
    query +=    'AND G1.id = B.GareDepart AND G2.id = B.GareArrivee'
    connection.query(query, [idBillet], (err, res, _field) => {
        cb(res, err)
    })
}

exports.getVilles = (cb) => {
    // Renvoie toutes les villes dans la base de donnee
    connection.query('SELECT * FROM Villes ORDER BY Name', (err, res, _field) => {
        cb(res, err)
    })

}

exports.createClient = (prenom, nom, type, reduction, login, password, cb) => {
    // Creer un client dans la base de donnee, le login est unique et le password est chiffré
    let query = 'INSERT INTO Clients (Prenom, Nom, Type, Reduction, login, password) '
    query +=    'VALUES (?, ?, ?, ?, ?, ?)'
    connection.query(query, [prenom, nom, type, reduction, login, password], (err, res, _field) => {
        cb(res, err)
    })
}

exports.findClientByLogin = (login, cb) => {
    // Renvoie un client identifié par son login
    let query = 'SELECT Prenom, Nom, Type, Reduction, Taux, login, password '
    query +=    'FROM Clients, Reduction '
    query +=    'WHERE login=? AND Reduction.idReduction = Clients.Reduction'
    connection.query(query, [login], (err, res, _field) => {
        cb(res, err)
    })
}

exports.makeReservation = (clientId, idBillet, numVoiture, numPlace, cb) => {
    // Entre une reservation dans la bdd
    let query = 'INSERT INTO Reservation (Client, Billet, NumeroVoiture, NumeroPlace) '
    query += 'VALUES (?, ?, ?, ?)'
    connection.query(query, [clientId, idBillet, numVoiture, numPlace], (err, res, _field) => {
        cb(res, err)
    })
}

exports.findReservationsByLogin = (clientId, cb) => {
    // 
    let query = 'SELECT R.NumeroVoiture, R.NumeroPlace, B.HeureDepart, B.HeureArrivee, B.Prix, B.Train, B.VilleDestination, '
    query +=    'B.VilleDepart, G1.Name GareDepart, G2.Name GareDestination, '
    query +=    'DATE(B.DateDepart) DateDepart, '
    query +=    'TIMEDIFF(TIMESTAMP(B.DateArrivee,B.HeureArrivee),TIMESTAMP(B.DateDepart,B.HeureDepart)) Duree '
    query +=    'FROM Billet B, Gares G1, Gares G2, Reservation R '
    query +=    'WHERE B.idBillet=R.Billet '
    query +=    'AND G1.id = B.GareDepart AND G2.id = B.GareArrivee '
    query +=    'AND R.Client=? '
    query +=    'ORDER BY B.DateDepart, B.HeureDepart'
    connection.query(query, [clientId], (err, res) => {
        cb(res, err)
    })
}

exports.getNumerosVoiture = (idBillet, cb) => {
    // Renvoie les numeros des voitures du train associé à un billet
    let query = 'SELECT V.Numero '
    query +=    'FROM Billet B, Voiture V '
    query +=    'WHERE B.Train = V.Train '
    query +=    'AND B.idBillet=? '
    query +=    'ORDER BY V.Numero'
    connection.query(query, [idBillet], (err, res) => {
        cb(res, err)
    })
}

exports.getNumerosPlace = (idBillet, numVoiture, cb) => {
    // Renvoie les numeros des places disponibles associé à une voiture donnée
    let query = 'SELECT P.Numero '
    query +=    'FROM Place P, Voiture V, Billet B '
    query +=    'WHERE P.Voiture = V.idVoiture '
    query +=    'AND V.Train = B.Train '
    query +=    'AND B.idBillet=? AND V.Numero=? '
    query +=    'AND (B.idBillet, V.Numero, P.Numero) '
    query +=    'NOT IN (SELECT Billet, NumeroVoiture, NumeroPlace '
    query +=    '        FROM Reservation) '
    query +=    'ORDER BY P.Numero'
    connection.query(query, [idBillet, numVoiture], (err, res) => {
        cb(res, err)
    })
}