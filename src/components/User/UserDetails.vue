<template>
    <h2>{{ editing ? 'Bewerken' : 'Steward' }}</h2>
    <form @submit.prevent="saveUser">
      <div class="form-group">
        <label for="name">Naam:</label>
        <input type="text" id="name" v-model="user.name" :disabled="!editing" />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email" :disabled="!editing" />
      </div>

      <div class="form-group">
        <label for="role">Rol:</label>
        <select id="role" v-model="user.role" :disabled="!editing">
          <option value="admin">Beheerder</option>
          <option value="chief">Hoofdsteward</option>
          <option value="steward">Steward</option>
        </select>
      </div>

      <div class="form-group">
        <label for="approved">Goedgekeurd:</label>
        <select id="approved" v-model="user.approved" :disabled="!editing">
          <option value="true">Ja</option>
          <option value="false">Nee</option>
        </select>
      </div>

      <div class="form-group">
        <label for="water">Waterwerking:</label>
        <select id="water" v-model="user.water" :disabled="!editing">
          <option v-for="water in sortedWaters" :value="water.uid" :key="water.uid">{{ water.werkingnaam }}</option>
        </select>
      </div>

      <div class="button-group">
      <button type="button" class="tertiary" @click="confirmDeleteUser">Verwijder</button>
  
     <div>
        <button type="button" class="primary" @click="editing = !editing">
          {{ editing ? 'Annuleer' : 'Bewerken' }}
        </button>
        <button v-if="editing" class="primary" type="submit">Opslaan</button>
      </div>
    </div>
    </form>
   
</template>

<script setup>
import { computed, onMounted, ref, defineEmits } from 'vue';
import { collection, doc, getFirestore, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const firestore = getFirestore();

const emit = defineEmits();

const { user } = defineProps(['user']);

const editing = ref(false);
const waters = ref([]);

const fetchWaters = async () => {
  const waterCollection = collection(firestore, 'waters');
  const waterSnapshot = await getDocs(waterCollection);
  return waterSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
};

onMounted(async () => {
  waters.value = await fetchWaters();
});

const confirmDeleteUser = () => {
if (window.confirm('Bent u zeker dat u deze steward wilt verwijderen?')) {
  deleteUser();
  }
};

const sortedWaters = computed(() => {
  return waters.value.slice().sort((a, b) => a.werkingnaam.localeCompare(b.werkingnaam));
});

const saveUser = async () => {
  const userCollection = collection(firestore, 'users');
  const userDoc = doc(userCollection, user.id);

  await updateDoc(userDoc, {
    name: user.name,
    email: user.email,
    role: user.role,
    //bool for approved
    approved: Boolean(user.approved),
    water: user.water,
  });
  editing.value = false;
  
};


const deleteUser = async () => {
  const userCollection = collection(firestore, 'users');
  const userDoc = doc(userCollection, user.id);
  
  try {
    await deleteDoc(userDoc);
    emit('userDeleted', user.id); 
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
</script>

<style scoped>
.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
