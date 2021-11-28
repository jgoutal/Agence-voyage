<template>
  <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="title">Gare d'arrivée</label>
        <input
          type="text"
          class="form-control"
          id="arrivee"
          required
          v-model="billet.GareArrivee"
          name="arrivee"
        />
      </div>

      <div class="form-group">
        <label for="title">Gare de départ</label>
        <input
          type="text"
          class="form-control"
          id="depart"
          required
          v-model="billet.GareDepart"
          name="depart"
        />
      </div>

      <div class="form-group">
        <label for="description">Prix</label>
        <input
          class="form-control"
          id="Prix"
          required
          v-model="billet.Prix"
          name="Prix"
        />
      </div>

      <button @click="saveBillet" class="btn btn-success">Save</button>
    </div>

    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newBillet">Add billet</button>
    </div>
  </div>
</template>

<script>
import BilletDataService from "../services/BilletDataService";

export default {
  name: "add-billet",
  data() {
    return {
      billet: {
        idBillet: null,
        GareArrivee: "",
        GareDepart: "",
        Prix: "",
        published: false
      },
      submitted: false
    };
  },
  methods: {
    saveBillet() {
      var data = {
        GareArrivee: this.billet.GareArrivee,
        GareDepart: this.billet.GareDepart,
        Prix: this.billet.Prix
      };

      BilletDataService.create(data)
        .then(response => {
          this.billet.idBillet = response.data.idBillet;
          console.log(response.data);
          this.submitted = true;
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    newBillet() {
      this.submitted = false;
      this.billet = {};
    }
  }
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>