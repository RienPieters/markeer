<template>
      <Filter @filteredCheckups="updateFilteredCheckups" @availableWaters="updateAvailableWaters" />
      <button class="fixed" :class="{ 'transparent': isTransparent }" @click="exportToExcel(selectedWater, availableWaters, selectedWaterUid)">Exporteren</button>
  
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Steward</th>
            <th>Aantal markers</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(checkup) in sortedFilteredCheckups" :key="checkup.id" @click="openCheckupDetails(checkup)">
            
            <td>{{ formatDate(checkup.start.toDate()) }}</td>
            <td>{{ checkup.steward }}</td>
            <td>{{ calculateTotalMarkers(checkup) }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Display CheckupDetails modal only when a checkup is selected -->
      
      <div v-if="selectedCheckup" class="modal">
  <div class="modal-content">
    <button class="close-button" @click="closeModal">&times;</button>
    <CheckupDetails
      v-if="selectedCheckup"
      :checkup="selectedCheckup"
      @checkupDeleted="handleCheckupDeleted"
    />
  </div>
</div>

  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  import Filter from '@/components/Filter.vue';
  import { markerCode } from '@/lib/consts';
  import { exportExcel } from '@/_helpers/excel';
  import CheckupDetails from './CheckupDetails.vue';
  const selectedCheckup = ref(null);
  const checkups = ref([]);
  const filteredCheckups = ref([]);
  const availableWaters = ref([]);
const selectedWaterUid = ref([]);
const isTransparent = ref(false);
let prevScrollY = 0;


window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  isTransparent.value = currentScrollY > prevScrollY;
  prevScrollY = currentScrollY;
});

const selectedWater = computed(() => {
  const waterUid = selectedWaterUid.value;
  return availableWaters.value.find(water => water.uid === waterUid) || null;
});

const handleCheckupDeleted = (deletedCheckupUid) => {
  // Remove the deleted checkup from filteredCheckups
  filteredCheckups.value = filteredCheckups.value.filter(
    (checkup) => checkup.uid !== deletedCheckupUid)

    closeModal();
};
  
  const updateAvailableWaters = (newAvailableWaters) => {
    availableWaters.value = newAvailableWaters;
  };
  
  // Update the filteredCheckups property when the event is emitted from Filter component
  const updateFilteredCheckups = (newFilteredCheckups) => {
    filteredCheckups.value = newFilteredCheckups;
  };

  const sortedFilteredCheckups = computed(() => {
  return filteredCheckups.value.slice() // Create a copy of the filteredCheckups array
    .sort((a, b) => (b.start || 0) - (a.start || 0)); // Sort in descending order
});
  
  const markerCodeKeys = markerCode.map(code => Object.keys(code)[0]);
  

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('nl-BE', options);
};

const calculateDurationInMinutes = (start, end) => {
  const startTime = start.toMillis();
  const endTime = end.toMillis();
  const durationMillis = endTime - startTime;
  const durationMinutes = durationMillis / (1000 * 60);
  return Math.round(durationMinutes);
};

const countMarkersForCode = (checkup, codeKey) => {
  const markersMap = checkup.markers || {};
  const markers = Object.values(markersMap).flat();
  const codeMarkers = markers.filter(marker => marker.code === codeKey);
  return codeMarkers.length;
};

const calculateTotalMarkers = (checkup) => {
  let totalMarks = 0;
  for (const codeKey of markerCodeKeys) {
    totalMarks += countMarkersForCode(checkup, codeKey);
  }
  return totalMarks;
  // Implement your logic here
};
const openCheckupDetails = (checkup) => {
  selectedCheckup.value = checkup; // Set the selected checkup for modal
  console.log('Selected Checkup:', selectedCheckup.value);
};

const closeModal = () => {
  selectedCheckup.value = null;
};

const exportToExcel = (selectedWater, availableWaters) => {
    const selectedWaterName = selectedWater ? selectedWater.werkingnaam : 'Checkups';

  const checkupsWithCodeCounts = sortedFilteredCheckups.value.map(checkup => {
    const codeCounts = {};
    for (const codeKey of markerCodeKeys) {
      codeCounts[codeKey] = countMarkersForCode(checkup, codeKey);
    }

    const water = availableWaters.find(water => water.uid === checkup.water);

    const duration = checkup.start && checkup.end
      ? calculateDurationInMinutes(checkup.start, checkup.end)
      : '';

    return {
      'Locatie': water ? water.werkingnaam : '',
      'Datum': formatDate(checkup.start ? checkup.start.toDate() : null),
      'Duur (min)': duration,
      'Steward': checkup.steward,
      ...codeCounts,
      'Aantal markers': calculateTotalMarkers(checkup),
      'Opmerkingen': checkup.remarks,
    };
  });

  // Export to Excel with the selected water name or 'Checkups'
  exportExcel(checkupsWithCodeCounts, selectedWaterName);
};


</script>

<style scoped>
.fixed {
  position: fixed;
  bottom: 60px;
  right: 20px;
  padding: 10px;
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
  font-size: 16px;
}

.fixed.transparent {
  background-color: transparent;
  color: transparent;
}
</style>
