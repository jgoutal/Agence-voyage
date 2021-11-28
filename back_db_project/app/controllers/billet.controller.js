const Billet = require("../models/billet.model.js");

// Create and Save a new Billet
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Billet
    const billet = new Billet({
      GareArrivee: req.body.GareArrivee,
      GareDepart: req.body.GareDepart,
      Prix: req.body.Prix,
      
    });
  
    // Save Billet in the database
    Billet.create(billet, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Billet."
        });
      else res.send(data);
    });
  };

// Retrieve all billets from the database (with condition).
exports.findAll = (req, res) => {
    const VilleArrivee = req.query.VilleArrivee;
  
    Billet.getAll(VilleArrivee, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving billets."
        });
      else res.send(data);
    });
  };


// Find a single billet with a id
exports.findOne = (req, res) => {
    Billet.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found billet with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving billet with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };


// Update a billet identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    console.log(req.body);
  
    Billet.updateById(
      req.params.id,
      new Billet(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found billet with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating billet with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
  };

// Delete a billet with the specified id in the request
exports.delete = (req, res) => {
    Billet.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Billet with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete billet with id " + req.params.id
          });
        }
      } else res.send({ message: `billet was deleted successfully!` });
    });
  };

// Delete all billets from the database.
exports.deleteAll = (req, res) => {
    Billet.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all billets."
        });
      else res.send({ message: `All billets were deleted successfully!` });
    });
  };