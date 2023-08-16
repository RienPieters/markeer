<template>
  <div class="container">
    <h1>Inloggen</h1>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="text" placeholder="Email" v-model="email" />
    </div>
    <div class="form-group">
      <label for="password">Wachtwoord</label>
      <input type="password" placeholder="Wachtwoord" v-model="password" />
    </div>
    <div class="form-group">
    <button @click="openModal" class="tertiary">Wachtwoord vergeten?</button>
  </div>
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    <button class="primary" @click="login">Login</button>
    <p style="font-size: 13px;">Heb je nog geen account? <router-link class="tertiary" to="/register">Registreer hier</router-link></p>
  </div>
  <div v-if="showForgotPassword" class="modal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">&times;</button>
      <ForgotPassword @closeModal="closeModal" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/init';
import { useRouter } from 'vue-router';
import ForgotPassword from '@/components/ForgotPassword.vue';
import store from '@/store';

const showForgotPassword = ref(false);
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();

const openModal = () => {
  showForgotPassword.value = true;
};

const closeModal = () => {
  showForgotPassword.value = false;
};

const login = async () => {
  errorMsg.value = '';

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

    // Successfully logged in
    const user = userCredential.user;

    await store.dispatch('setUserRolesFromAuth', user.uid);

    // Cache the current user's authentication state
    await store.dispatch('cacheCurrentUser');

    // Commit the loggedIn state and current user to the store
    store.commit('setLoggedIn', true);
    store.commit('setCurrentUser', user);


    // Successfully logged in
    router.push({ name: 'Home' });
  } catch (error) {
    const errorMessages = {
      'auth/invalid-email': 'Ongeldige email',
      'auth/user-not-found': 'Gebruiker niet gevonden',
      'auth/wrong-password': 'Ongeldig wachtwoord',
      default: 'Er is iets fout gegaan',
    };
    
    errorMsg.value = errorMessages[error.code] || errorMessages.default;
  }
};
</script>

<style scoped>



forgot-password-button{
  background-color: transparent;
  border: none;
  color: #000;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 1rem;
}

.primary {
  margin: 1rem;
}

button {
  width:60vw;
}

</style>
