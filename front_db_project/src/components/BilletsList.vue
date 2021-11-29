<template>
  <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Entrer le nom d'une ville"
          v-model="VilleArrivee"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button"
            @click="searchVille"
          >
            Search
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <h4>Billets List : </h4>
      <ul class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(billet, index) in billets"
          :key="index"
          @click="setActiveBillet(billet, index)"
        >
          Date Depart: {{billet.DateDepart}}
          <br/>
          Arrivée : {{ billet.VilleDestination }}
        </li>
      </ul>

      <button class="m-3 btn btn-sm btn-danger" @click="removeAllBillets">
        Remove All
      </button>
    </div>
    <div class="col-md-6">
      <div v-if="currentBillet">
        <h4>Billet</h4>
        <div>
          <label><strong>Gare arrivee:</strong></label> {{ currentBillet.GareArrivee }}
        </div>
        <div>
          <label><strong>Gare depart:</strong></label> {{ currentBillet.GareDepart}}
        </div>
        <div>
          <label><strong>Prix:</strong></label> {{ currentBillet.Prix}}
        </div>
        <div>
          <label><strong>Date depart:</strong></label> {{ currentBillet.DateDepart}}
        </div>
        <div>
          <label><strong>Heure depart:</strong></label> {{ currentBillet.HeureDepart}}
        </div>
        <div>
          <label><strong>Date Arrivee:</strong></label> {{ currentBillet.DateArrivee}}
        </div>
        <div>
          <label><strong>Heure Arrivee:</strong></label> {{ currentBillet.HeureArrivee}}
        </div>
        <div>
          <label><strong>Ville depart:</strong></label> {{ currentBillet.VilleDepart}}
        </div>
        <div>
          <label><strong>Destination :</strong></label> {{ currentBillet.VilleDestination}}
        </div>

        <router-link :to="'/billets/' + currentBillet.idBillet" :id="currentBillet.idBillet" class="badge badge-seecondary" style="width: 20px height:10px">Acheter</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BilletDataService from "../services/BilletDataService";

export default {
  name: "billets-list",
  data() {
    return {
      billets: [],
      currentBillet: null,
      currentIndex: -1,
      VilleArrivee: null,
    };
  },
  methods: {
    retrieveBillets() {
      BilletDataService.getAll()
        .then(response => {
          this.billets = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveBillets();
      this.currentBillet = null;
      this.currentIndex = -1;
    },

    setActiveBillet(billet, index) {
      this.currentBillet = billet;
      this.currentIndex = billet ? index : -1;
    },

    removeAllBillets() {
      BilletDataService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    searchVille() {
      BilletDataService.findByArrival(this.VilleArrivee)
        .then(response => {
          this.billets = response.data;
          this.setActiveBillet(null);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.retrieveBillets();
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>