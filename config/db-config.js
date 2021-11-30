let mysql = require('mysql')
let connection = mysql.createConnection({
    host:"localhost",
    user:"node",
    password:'password',
    database:'SNCF_app'
})

connection.connect(err => {
    if (err) throw err
    console.log("Succesfully connected to the database.")
})

module.exports = connection