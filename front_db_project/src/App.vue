<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">Agence de Voyage SNCF</router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/billets" class="nav-link">Billets</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/add" class="nav-link">Ajouter</router-link>
        </li>
      </div>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>
<script>


export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
