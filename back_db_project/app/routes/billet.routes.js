module.exports = app => {
    const billets = require("../controllers/billet.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Billet
    router.post("/", billets.create);
  
    // Retrieve all Billets
    router.get("/", billets.findAll);
  
    // Retrieve a single Billet with id
    router.get("/:id", billets.findOne);
  
    // Update a Billet with id
    router.put("/:id", billets.update);
  
    // Delete a Billet with id
    router.delete("/:id", billets.delete);
  
    // Delete all Billets
    router.delete("/", billets.deleteAll);
  
    app.use('/api/billets', router);
  };