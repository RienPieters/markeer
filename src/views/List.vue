<template>
  <div class="tab-switcher">
    
    <div class="tab-buttons">
      <button @click="switchTab('waters')" :class="{ 'tab-button': true, active: currentTab === 'waters' }">Waterwerkingen</button>
      <button @click="switchTab('users')" :class="{ 'tab-button': true, active: currentTab === 'users' }">Gebruikers</button>
    </div>
    
    <component :is="currentTabComponent" />
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import WatersList from '../components/Water/WatersList.vue';
import UsersList from '../components/User/UsersList.vue';

const currentTab = ref('waters');
const currentTabComponent = shallowRef(WatersList);

const switchTab = (tabName) => {
  currentTab.value = tabName;
  currentTabComponent.value = tabName === 'waters' ? WatersList : UsersList;
};

</script>

<style scoped>
.tab-switcher {
  margin-bottom: 60px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 5px;
}

.tab-buttons {
  display: flex;
  margin-bottom: 20px;
}

.tab-button {
  flex: 1;
  font-size: 16px;
  color: var(--black-color);
  border: none;
  padding: 8px 20px;
  margin: 0;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
}

.tab-button.active {
  background-color: var(--secondary-color);
  color: #ffffff;
}

.tab-button.active:hover {
  background-color: var(--secondary-color);
}

.tab-button:hover {
  background-color: var(--tertiary-color); 
}

.tab-button:not(:last-child) {
  margin-right: 5px; 
}
</style>

