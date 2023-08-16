<template>
  <nav v-if="isLoggedIn" class="navbar">
    <router-link to="/" class="nav-link" title="Home">Kaart</router-link>
    <router-link v-if="isAdmin" to="/list" class="nav-link" title="Lijst">Lijst</router-link>
    <router-link v-if="isAdmin || isChief" to="/export" class="nav-link" title="Export">Export</router-link>
    <router-link to="/settings" class="nav-link" title="Instellingen">Instellingen</router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isLoggedIn = computed(() => store.state.isLoggedIn);

// Conditionally access isAdmin and isChief properties only if the userRoles object is available
const isAdmin = computed(() => store.state.userRoles?.isAdmin);
const isChief = computed(() => store.state.userRoles?.isChief);
</script>
  
<style scoped>
.navbar {
  background-color: var(--white-color);
  position: fixed;
  bottom: 0;
  width: 100vw;
  z-index: 9999;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-link {
  font-size: 16px;
  color: var(--black-color);
  text-decoration: none;
  margin: 0 15px;
  padding: 10px 0;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
}

@media screen and (max-width: 768px) {
  .navbar {
    justify-content: space-around;
  }
}
</style>
