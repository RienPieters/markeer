<template>
  <div id="app">
    <Navbar />
    <router-view/>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import '@fortawesome/fontawesome-free/css/all.css';
import '@/assets/main.css';

</script>

<style>


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Jakarta", serif;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


/* Hide mapbox logo */
.mapboxgl-ctrl-logo {
  display: none !important;
}

/* Styles for mobile devices */
@media (max-width: 767px) {
  /* Adjust your mobile-specific styles here */
}

</style>
