<template>
        <h2>Checkup Details</h2>
        <p>Steward: {{ checkup.steward }}</p>
        <p>Start: {{ formatDate(checkup.start) }}</p>
        <p>Duur: {{ calculateDurationInMinutes(checkup.start, checkup.end) }} minuten</p>
        <p>Opmerkingen: {{ checkup.remarks }}</p>
        <button class="tertiary left" v-if="isAdmin" @click="confirmDeleteCheckup">Verwijder</button>

  </template>
  
  <script setup>
  import { ref, defineProps, onMounted, computed, defineEmits } from 'vue';
  import { collection, deleteDoc, doc, getFirestore } from 'firebase/firestore';
  import { useStore } from 'vuex';

  const store = useStore();



const isAdmin = computed(() => store.state.userRoles.isAdmin);

  const props = defineProps({
  checkup: Object, 
});
  const checkup = ref({});
  
  const emit = defineEmits();

 
  onMounted(() => {
  checkup.value = props.checkup;
});
const confirmDeleteCheckup = () => {
if (window.confirm('Bent u zeker dat u deze checkup wilt verwijderen?')) {
    deleteCheckup();
  }
};

const deleteCheckup = async () => {

  const firestore = getFirestore();
  const checkupCollection = collection(firestore, 'checkups');
  try {
    const checkupDocRef = doc(checkupCollection, checkup.value.uid);
    deleteDoc(checkupDocRef);
    console.log('Checkup deleted successfully');
  } catch (error) {
    console.error('Error deleting checkup:', error);
  }
  emit('checkupDeleted', checkup.value.uid);
  
};

const calculateDurationInMinutes = (start, end) => {
  if (!start || !end) return 0; 
  const durationInMilliseconds = end.toMillis() - start.toMillis();
  return Math.round(durationInMilliseconds / 1000 / 60);
};

  
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = timestamp.toDate();
  return date.toLocaleDateString('nl-BE', options);
};
  </script>

  <style scoped>

    </style>
