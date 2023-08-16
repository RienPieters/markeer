<template>
  <div class="filter-container">
    <div class="filter-group">
      <div class="input-group">
        <label for="startDate">Van:</label>
        <input
          type="date"
          class="select-input"
          v-model="selectedStartDate"
          @input="applyFilter"
        />
      </div>

      <div class="input-group">
        <label for="endDate">Tot:</label>
        <input
          type="date"
          class="select-input"
          v-model="selectedEndDate"
          @input="applyFilter"
        />
      </div>
    </div>

    <div class="filter-group">
      <div class="label-select">
        <label for="selectedWater">Waterwerking:</label>
        <select
          class="select-input"
          v-model="selectedWaterUid"
          @change="applyFilter"
        >
          <option value="" selected>Alle</option>
          <option
            v-for="water in sortedAvailableWaters"
            :value="water.uid"
            :key="water.uid"
          >{{ water.werkingnaam }}</option>
        </select>
      </div>
    </div>

</div>
<button class="tertiary" @click="resetFilters">Filters resetten</button>
</template>

<script setup>
import { ref, onMounted, watchEffect, defineEmits } from 'vue';
import { computed } from 'vue';
import { fetchCheckups, fetchWaters } from '@/_helpers/fetchData';

const emit = defineEmits();

const selectedStartDate = ref('');
const selectedEndDate = ref('');
const selectedWaterUid = ref('');
const availableWaters = ref([]);
const filteredCheckups = ref([]);
const checkups = ref([]);

// Fetch data on component mount
onMounted(async () => {
  const fetchedCheckups = await fetchCheckups();
  checkups.value = fetchedCheckups;
  const fetchedWaters = await fetchWaters();
  availableWaters.value = fetchedWaters;
  applyFilter();
});



const selectedWater = computed(() => {
  const waterUid = selectedWaterUid.value;
  return availableWaters.value.find(water => water.uid === waterUid) || null;
});

const applyFilter = () => {
  const startDate = selectedStartDate.value ? new Date(selectedStartDate.value) : null;
  const endDate = selectedEndDate.value ? new Date(selectedEndDate.value) : null;

  // Set the time of entire day
  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  filteredCheckups.value = checkups.value.filter(checkup => {
    const checkupDate = checkup.start.toDate();

    // Include checkups that are on or after the selected start date
    const isAfterStartDate = !startDate || checkupDate >= startDate;

    // Include checkups that are on or before the selected end date
    const isBeforeEndDate = !endDate || checkupDate <= endDate;

    return isAfterStartDate && isBeforeEndDate && (!selectedWaterUid.value || checkup.water === selectedWaterUid.value);
  });
  emit('filteredCheckups', filteredCheckups.value);
  emit('selectedWater', selectedWater.value);
  emit('availableWaters', availableWaters.value);
  emit('selectedWaterUid', selectedWaterUid.value);
};

// Reset filters
const resetFilters = () => {
  selectedStartDate.value = '';
  selectedEndDate.value = '';
  selectedWaterUid.value = '';
  applyFilter();
};

// Watch for changes in inputs and apply filter
watchEffect(() => {
  applyFilter();
});

const sortedAvailableWaters = computed(() => {
  return availableWaters.value.slice().sort((a, b) => {
    return a.werkingnaam.localeCompare(b.werkingnaam);
  });
});

</script>

<style scoped>

.filter-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.label-select {
  display: flex;
  flex-direction: column;
  flex: 2;
}

label {
  text-align: left;
}

.select-input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.select-input:focus {
  border-color: var(--primary-color);
}

</style>
