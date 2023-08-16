<template>
  <div>
        <div class="form-group">
          <label for="reset-email">Email</label>
          <input type="text" placeholder="Email" v-model="email">
        </div>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <button class="primary"  @click="resetPassword">Verstuur</button>
      </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { sendPasswordResetEmail } from 'firebase/auth';
  import {auth} from '../firebase/init';
  
  const email = ref('');
  const successMsg = ref('');
  const errorMsg = ref('');
  
  const resetPassword = async () => {
    errorMsg.value = '';
    successMsg.value = '';
  
    try {
      await sendPasswordResetEmail(auth, email.value);
  
      successMsg.value = 'Herstel link verstuurd naar je email';
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
        case 'auth/user-not-found':
          errorMsg.value = 'Gebruiker niet gevonden';
          break;
        default:
          errorMsg.value = 'Er is iets fout gegaan';
          break;
      }
      console.error('Fout tijdens wachtwoord herstellen:', error);
    }
  };
  </script>
  
  <style scoped>

.form-group {

  margin-top: 2em;
}
  </style>
  