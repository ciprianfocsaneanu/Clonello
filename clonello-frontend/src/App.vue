<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#/dashboard">Clonello</b-navbar-brand>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
html, body {
  margin: 0;
  height: 100%;
  background-color: #5BA4CF;
}
.bg-info {
  background-color: #0079bf !important;
}
input {
  border-radius: 10px;
  outline: none;
}
.page-title {
  font-size: 18px;
  margin: 20px 0;
  color: white;
}
</style>
