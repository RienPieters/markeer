<template>
  <div class="controls">
    <div class="button-group">
      <button @click="toggleCheckup" :disabled="startingCheckup || savingMarker">{{ checkupButtonLabel }}</button>
      <button @click="togglePlaceMarker" :disabled="!checkupStarted || savingMarker">{{ placeMarkerButtonLabel }}</button>
    </div>
    <div v-if="showMarkerForm && !savingMarker">
      <div class="marker-section">
        <select v-model="selectedCode" :disabled="!checkupStarted" v-if="showCodeInput">
          <option value="" disabled>Kies een code</option>
          <option v-for="(code, index) in markerCode" :value="Object.keys(code)[0]" :key="index">{{ Object.values(code)[0] }}</option>
        </select>
        <button @click="saveMarker" :disabled="!selectedCode || savingMarker" v-if="showCodeInput">
          <span>Bevestigen</span>
        </button>
      </div>
    </div>
  </div>

  <div v-if="showRemarksModal" class="modal">
    <div class="modal-content">
      <h3>Opmerkingen</h3>
      <textarea v-model="remarks" rows="5"></textarea>
      <div class="modal-buttons">
        <button class="primary" @click="closeRemarksModal">Annuleren</button>
        <button class="primary" @click="saveRemarksAndEndCheckup(remarks)">Opslaan</button>
      </div>
    </div>
  </div>

  <div v-if="showHowToUseModal" class="modal">
    <div class="modal-content">
      <button class="close-button" @click="closeHowToUseModal">&times;</button>
      <h3>Handleiding</h3>
      <ul>
        <li>Stap 1: Start een check-up door op de knop "Check-up starten" te klikken.</li>
        <li>Stap 2: Plaats een marker door op de knop "Marker plaatsen" te klikken.</li>
        <li>Stap 3: Kies een code uit de lijst en klik op "Bevestigen".</li>
        <li>Stap 4: Klik op de knop "Stop Check-up" om de check-up te beëindigen.</li>
      </ul>
      <sub>Arteveldehogeschool, Grafische en Digitale media</sub>
    </div>
  </div>

  <button @click="openHowToUseModal" class="how-to-use-button">
    <li class="fas fa-question"></li>
  </button>
</template>

<script setup>
import { getFirestore, collection, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { markerCode } from '../lib/consts';
import { getCurrentUser } from '../_helpers/auth';
import { ref } from 'vue';
import { getCurrentPosition, fetchUserData } from '../_helpers/fetchData';

const inactivityTimeoutMinutes = ref(15);

const checkupStarted = ref(false);
const startingCheckup = ref(false);
const selectedCode = ref('');
const showCodeInput = ref(false);
const showMarkerForm = ref(false);
const checkupId = ref(null);
const savingMarker = ref(false);
const checkupButtonLabel = ref('Start Check-up');
const placeMarkerButtonLabel = ref('Zet Marker');
const markers = ref([]);
const showRemarksModal = ref(false);
const remarksModalTriggered = ref(false);
const remarks = ref('');
const inactivityTimer = ref(null);
const showHowToUseModal = ref(false);

const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

// Function to reset inactivity timer
const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer.value);

  inactivityTimer.value = setTimeout(() => {
    if (checkupStarted.value) {
      saveRemarksAndEndCheckup('Ended due to inactivity.');
    }
  }, inactivityTimeoutMinutes.value * 60 * 1000);
};

const toggleCheckup = async () => {
  if (!checkupStarted.value && !startingCheckup.value) {
    startingCheckup.value = true; // Disable the button
    await startCheckup();
    startingCheckup.value = false; // Re-enable the button
  } else if (checkupStarted.value) {
    remarksModalTriggered.value = true;
    showRemarksModal.value = true;
  }
};

// Function to start checkup
const startCheckup = async () => {
  const firestore = getFirestore();
  const checkupCollection = collection(firestore, 'checkups');

  const user = await getCurrentUser();

  const userObject = await fetchUserData(user.uid)

  if (!checkupId.value) {
    markers.value = [];

    const docRef = await addDoc(checkupCollection, {
      markers: [],
      start: serverTimestamp(),
      steward: userObject.name,
      water: userObject.water,
    });

    checkupId.value = docRef.id;
    checkupStarted.value = true;

    checkupButtonLabel.value = 'Stop Check-up';
    placeMarkerButtonLabel.value = 'Zet Marker';

    localStorage.setItem('checkupId', checkupId.value);
  }
};

const togglePlaceMarker = () => {
  showMarkerForm.value = !showMarkerForm.value;
  showCodeInput.value = showMarkerForm.value;
  placeMarkerButtonLabel.value = showMarkerForm.value ? 'Annuleer' : 'Zet Marker';

  if (!showMarkerForm.value) {
    selectedCode.value = '';
  }
};

// Function to save a marker
const saveMarker = async () => {
  if (!selectedCode.value || savingMarker.value) {
    return;
  }

  savingMarker.value = true;

  try {
    const position = await getCurrentPosition();

    const { latitude, longitude } = position.coords;
    const markerData = {
      latitude,
      longitude,
      code: selectedCode.value,
      solved: false,
    };

    const markerId = generateUniqueId();
    const firestore = getFirestore();
    const checkupDocRef = doc(firestore, 'checkups', checkupId.value);

    await updateDoc(checkupDocRef, {
      [`markers.${markerId}`]: markerData,
    });

    markers.value.push(markerData);

    selectedCode.value = '';
    showCodeInput.value = false;
    placeMarkerButtonLabel.value = 'Zet Marker';
  } catch (error) {
    console.error('Error during marker saving:', error);
  } finally {
    savingMarker.value = false;
  }
};

// Function to save remarks and end checkup
const saveRemarksAndEndCheckup = async (remarksValue) => {
  if (checkupId.value) {
    const firestore = getFirestore();
    const checkupDocRef = doc(firestore, 'checkups', checkupId.value);

    try {
      await updateDoc(checkupDocRef, {
        end: serverTimestamp(),
        remarks: remarksValue,
      });
    } catch (error) {
      console.error('Error with saving checkup:', error);
    }

    remarks.value = ''; 
    remarksModalTriggered.value = false;
    checkupStarted.value = false;
    checkupId.value = null;
    checkupButtonLabel.value = 'Start Check-up';

    localStorage.removeItem('checkupId');
    showRemarksModal.value = false; 
  }
};

// Event listeners to reset inactivity timer
window.addEventListener('mousemove', resetInactivityTimer);
window.addEventListener('touchmove', resetInactivityTimer);

// Check if there is a checkup in progress
const checkupIdFromStorage = localStorage.getItem('checkupId');
if (checkupIdFromStorage) {
  checkupStarted.value = true;
  checkupId.value = checkupIdFromStorage;
  checkupButtonLabel.value = 'Stop Check-up';
  placeMarkerButtonLabel.value = 'Zet Marker';
}
const closeRemarksModal = () => {
  showRemarksModal.value = false;
  remarksModalTriggered.value = false;
};
const openHowToUseModal = () => {
  showHowToUseModal.value = true;
};

const closeHowToUseModal = () => {
  showHowToUseModal.value = false;
};
</script>

<style scoped>
.how-to-use-button {
  top: 60px;
  right: 10px;
  height:40px;
  width: 40px;
  font-size: 16px;
  font-weight: light;
  color: var(--primary-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  transition: background-color 0.3s;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  background-color: rgb(255, 255, 255);
  z-index: 1;
}
.controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
}

.button-group {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.controls button {
  padding: 0 1vw;
  height: 40px;
  width: 35vw;
  font-size: 16px;
  font-weight: light;
  color: var(--primary-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white-color);
  margin-right: 2vw;
}

.controls button:last-child {
  margin-right: 0;
}

select {
  width: 35vw;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  height: 40px;
  padding: 0 10px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
  cursor: pointer;
  margin-bottom: 5px;
}

select:focus {
  outline: none;
  border-color: var(--primary-color);; 
}

.controls button:disabled {
  background-color: transparent;
  color: rgba(0, 0, 0, 0.509);
  cursor: not-allowed;
}

.fas.fa-question {
  font-size: 27px;
}

</style>
