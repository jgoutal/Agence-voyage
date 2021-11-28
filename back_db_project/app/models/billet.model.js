const sql = require("./db.js");

// constructor
const Billet = function(billet) {
  this.GareArrivee = billet.GareArrivee;
  this.GareDepart = billet.GareDepart;
  this.Prix = billet.Prix;
};

Billet.create = (newBillet, result) => {
  sql.query("INSERT INTO Billet SET ?", newBillet, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created billet: ", { id: res.insertId, ...newBillet });
    result(null, { id: res.insertId, ...newBillet });
  });
};

Billet.findById = (id, result) => {
  sql.query(`SELECT * FROM Billet WHERE idBillet = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found billet: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Billet with the id
    result({ kind: "not_found" }, null);
  });
};

Billet.getAll = (Ville, result) => {
  let query = "SELECT Billet.* FROM Billet, Gares";

  if (Ville) {
    query += ` WHERE Gares.IdVille = ${Ville} AND Billet.GareArrivee = Gares.id'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("billets: ", res);
    result(null, res);
  });
};


Billet.updateById = (idBillet, billet, result) => {
  sql.query(
    "UPDATE Billet SET GareArrivee = ?, GareDepart = ?, Prix = ? WHERE idBillet = ?",
    [billet.GareArrivee, billet.GareDepart, billet.Prix, idBillet],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Billet with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated billet: ", { idBillet: idBillet, ...billet });
      result(null, { idBillet: idBillet, ...billet });
    }
  );
};

Billet.remove = (idBillet, result) => {
  sql.query("DELETE FROM Billet WHERE idBillet = ?", idBillet, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Billet with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted billet with id: ", idBillet);
    result(null, res);
  });
};

Billet.removeAll = result => {
  sql.query("DELETE FROM Billet", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} billets`);
    result(null, res);
  });
};

module.exports = Billet;