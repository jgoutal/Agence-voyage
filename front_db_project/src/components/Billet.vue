<template>
  <div v-if="currentBillet" class="edit-form">
    <h4>Billet</h4>
    <form>
      <div class="form-group">
        <label for="arrivee">Gare arrivee : </label>
        <input type="text" class="form-control" id="arrivee"
          v-model="currentBillet.GareArrivee"
        />
      </div>
      <div class="form-group">
        <label for="depart">Gare depart : </label>
        <input type="text" class="form-control" id="depart"
          v-model="currentBillet.GareDepart"
        />
      </div>
      <div class="form-group">
        <label for="Prix">Prix : </label>
        <input type="text" class="form-control" id="Prix"
          v-model="currentBillet.Prix"
        />
      </div>
    </form>

    <button class="badge badge-danger mr-2"
      @click="deleteBillet"
    >
      Delete
    </button>

    <button type="submit" class="badge badge-success"
      @click="updateBillet"
    >
      Update
    </button>
    <p>{{ message }}</p>
  </div>

  <div v-else>
    <br />
    <p>Please click on a Billet...</p>
  </div>
</template>

<script>
import BilletDataService from "../services/BilletDataService";

export default {
  name: "billet",
  data() {
    return {
      currentBillet: null,
      message: ''
    };
  },
  methods: {
    getBillet(idBillet) {
      BilletDataService.get(idBillet)
        .then(response => {
          this.currentBillet = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateBillet() {
      BilletDataService.update(this.currentBillet.idBillet, this.currentBillet)
        .then(response => {
          console.log(response.data);
          this.message = 'The billet was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
    },

    deleteBillet() {
      BilletDataService.delete(this.currentBillet.idBillet)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "billets" });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.message = '';
    this.getBillet(this.$route.params.id);
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>