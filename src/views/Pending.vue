<template>
  <div class="container">
    <div class="pending">
      <h1>Goedkeuring afwachten</h1>
      <p>Uw account is aangemaakt, maar moet nog worden goedgekeurd door de beheerder.</p>
      <br>
      <button class="primary" @click="logout">Uitloggen</button>
    </div>
  </div>
</template>

<script setup>
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/init.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  signOut(auth)
    .then(() => {
      router.push({ name: 'Login' });
    })
    .catch((error) => {
      console.error(error);
    });
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--primary-color);
}

.pending {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: var(--white-color);
}

button {
  width:60vw;
}
</style>
