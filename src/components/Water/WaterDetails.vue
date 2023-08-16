<template>
  <div>
    <h2>{{ editing ? 'Edit Water' : 'Water Details' }}</h2>
    <form @submit.prevent="saveWater">
      <div class="form-group">
        <label for="werkingnaam">Werking Naam:</label>
        <input type="text" id="werkingnaam" v-model="water.werkingnaam" :disabled="!editing" />
      </div>

      <div class="form-group">
        <label for="water_locatie">Water Locatie:</label>
        <input type="text" id="water_locatie" v-model="water.water_locatie" :disabled="!editing" />
      </div>

      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="water.status" :disabled="!editing">
          <option value="actief">Actief</option>
          <option value="passief">Passief</option>
        </select>
      </div>

      <div class="form-group">
        <label for="provincie">Provincie:</label>
        <select id="provincie" v-model="water.provincie" :disabled="!editing">
          <option v-for="provincie in provincies" :key="provincie" :value="provincie">{{ provincie }}</option>
        </select>
      </div>
          
      <div class="button-group">
        <button class="tertiary" @click="confirmDeleteWater">Verwijder</button>
        <div>
        <button type="button" class="primary" @click="toggleEditing">
          {{ editing ? 'Annuleer' : 'Bewerken' }}
        </button>
        <button v-if="editing" class="primary" type="submit">Opslaan</button>
      </div>
    </div>
    </form>
   
  </div>
</template>

<script setup>
import { collection, doc, getFirestore, updateDoc, deleteDoc } from 'firebase/firestore';
import { defineProps, ref, defineEmits } from 'vue';
import { provincies } from '@/lib/consts';

const firestore = getFirestore();

const props = defineProps({
  water: Object,
});
const emit = defineEmits();
const editing = ref(false);
const toggleEditing = () => {
  editing.value = !editing.value;
}


const saveWater = async () =>{
  const waterCollection = collection(firestore, 'waters');

  const waterDoc = doc(waterCollection, props.water.id);
  await updateDoc(waterDoc, {
    werkingnaam: props.water.werkingnaam,
    water_locatie: props.water.water_locatie,
    status: props.water.status,
    provincie: props.water.provincie,
  });
  editing.value = false;

}

const confirmDeleteWater = () => {
  if (confirm('Bent u zeker dat u deze waterwerking wilt verwijderen?')) {
    deleteWater();
  }
};

const deleteWater = async () => {
  const waterCollection = collection(firestore, 'waters');

  try {
    await deleteDoc(doc(waterCollection, props.water.id));
    console.log('Water deleted successfully');
    emit('waterDeleted', props.water.id);
  } catch (error) {
    console.error('Error deleting water:', error);
  }
}
</script>

<style scoped>
.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
