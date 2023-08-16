<template>
        <h2>Aanmaken Waterwerking</h2>
        <form @submit.prevent="addWater">
          <div class="form-group">
            <label for="new-werkingnaam">Naam:</label>
            <input type="text" id="new-werkingnaam" v-model="newWater.werkingnaam" />
          </div>
          <div class="form-group">
            <label for="new-status">Status:</label>
            <select id="new-status" v-model="newWater.status">
              <option value="actief">Actief</option>
              <option value="passief">Passief</option>
            </select>
          </div>
          <div class="form-group">
            <label for="location">Locatie:</label>
            <input type="text" id="location" v-model="newWater.water_locatie" />
          </div>
          <div class="form-group">
            <label for="provincie">Provincie:</label>
            <select id="provincie" v-model="newWater.provincie">
              <option disabled value="">Selecteer een provincie</option>
              <option v-for="provincie in provincies" :key="provincie" :value="provincie">{{ provincie }}</option>
            </select>
          </div>
  
          <div class="button-group">
            <button class="primary" type="submit">Aanmaken</button>
          </div>
        </form>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  import  { getFirestore, collection, addDoc} from 'firebase/firestore';
  import { provincies } from '@/lib/consts.js';
  
  const emit = defineEmits();
  const newWater = ref({ werkingnaam: '', status: 'actief', water_locatie: '', provincie: '' });
  
  async function addWater() {
  const firestore = getFirestore();
  const waterCollection = collection(firestore, 'waters');

  try {
    // Add the new water entry to Firestore
    const addedWaterDoc = await addDoc(waterCollection, newWater.value);
    console.log('Water added successfully with ID:', addedWaterDoc.id);

    // Emit the added water to the parent component
    emit('waterAdded', { id: addedWaterDoc.id, ...newWater.value });

    // Clear the form
    newWater.value = { werkingnaam: '', status: 'actief', water_locatie: '', provincie: '' };

    closeModal();
  } catch (error) {
    console.error('Error adding water:', error);
  }
}
  
  function closeModal() {
    emit('closeModal');
  }
  </script>
  
  <style scoped>
  </style>
  