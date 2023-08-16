<template>
  <div>
    <button class="fixed" :class="{ 'transparent': isTransparent }" @click="openAddModal">&#43;</button>
    <table>
      <thead>
        <tr>
          <th>Werkingnaam</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="water in sortedWaters" :key="water.id" @click="openEditModal(water)">
          <td>{{ water.werkingnaam }}</td>
          <td>{{ water.status }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal overlays -->
    <div v-if="selectedWater" class="modal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">&times;</button>
        <WatersDetails :water="selectedWater" @waterDeleted="handleWaterDeleted"/>
      </div>
    </div>
  

  <div v-if="addingWater" class="modal">
      <div class="modal-content">
        <button class="close-button" @click="closeAddModal">&times;</button>
        <AddWater @waterAdded="handleWaterAdded" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import WatersDetails from './WaterDetails.vue';
import AddWater from './AddWater.vue';

const waters = ref([]);
const selectedWater = ref(null);
const addingWater = ref(false);
const isTransparent = ref(false);
let prevScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  isTransparent.value = currentScrollY > prevScrollY;
  prevScrollY = currentScrollY;
});
const fetchWaters = async () => {
  const firestore = getFirestore();
  const waterCollection = collection(firestore, 'waters');
  const waterSnapshot = await getDocs(waterCollection);
  const waterList = waterSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
  return waterList;
};



const handleWaterDeleted = (deletedWaterId) => {
  // Remove the deleted water from the waters array
  waters.value = waters.value.filter((water) => water.id !== deletedWaterId);

  closeModal();
};

const handleWaterAdded = (addedWater) => {
  waters.value.push(addedWater);

  closeAddModal();
};

const openEditModal = (water) => {
  selectedWater.value = water;
};

const closeModal = () => {
  selectedWater.value = null;
};

const sortedWaters = computed(() => {
  return waters.value.slice().sort((a, b) => a.werkingnaam.localeCompare(b.werkingnaam));
});

onMounted(async () => {
  waters.value = await fetchWaters();
});

const openAddModal = () => {
  addingWater.value = true;
}

const closeAddModal = () => {
  addingWater.value = false;
}

</script>

<style scoped>

.fixed {
  position: fixed;
  bottom: 60px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: var(--secondary-color);
  color:var(--white-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  padding-bottom: 10px;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}

.fixed.transparent {
  background-color: transparent;
  color: transparent;
}

</style>
