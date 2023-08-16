<template>
  <div class="settings">
    <h1>Instellingen</h1>
    <div class="form-container">
      <form>
        <div class="form-group">
          <label for="name">Naam:</label>
          <input type="text" id="name" v-model="newName" />
        </div>

        <div class="form-group">
          <label for="email">E-mail:</label>
          <input type="email" id="email" v-model="newEmail" />
        </div>

        <div class="form-group">
          <label for="water">Water:</label>
          <input type="text" id="water" :value="newWaterWerkingnaam" disabled />
        </div>

        <button class="primary" @click="updateSettings">Opslaan</button>
        <p v-if="settingsSaved" class="success-msg">Instellingen succesvol opgeslagen.</p>
      </form>
    </div>
    
  </div>
  <h2 style="margin-top: 2em;">Ben je klaar?</h2>
    <button class="tertiary" @click="handleLogout">Uitloggen</button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentUser } from '@/_helpers/auth';
import { signOut } from 'firebase/auth';
import { doc, getFirestore, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { auth } from '@/firebase/init';
import { useRouter } from 'vue-router';



const newName = ref('');
const newEmail = ref('');
const newWaterWerkingnaam = ref('');
const settingsSaved = ref(false);
const router = useRouter();

const updateSettings = async () => {
  try {
    const firestore = getFirestore();
    const currentUser = await getCurrentUser();
    const userRef = doc(firestore, 'users', currentUser.uid);

    // Update user settings in Firestore
    await updateDoc(userRef, {
      name: newName.value,
      email: newEmail.value,
    });

    settingsSaved.value = true;
    setTimeout(() => {
      settingsSaved.value = false;
    }, 3000); // 3 seconds
  } catch (error) {
    console.error('Fout bij het bijwerken van instellingen:', error);
  }
};

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      router.push({ name: 'Login' });
    })
    .catch((error) => {
      console.error(error);
    });
};

onMounted(async () => {
  try {
    const firestore = getFirestore();
    const currentUser = auth.currentUser;
    const userRef = doc(firestore, 'users', currentUser.uid);

    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    newName.value = userData.name || '';
    newEmail.value = userData.email || '';

    const waterCollection = collection(firestore, 'waters');
    const waterSnapshot = await getDocs(waterCollection);
    const waterList = waterSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

    const selectedWater = waterList.find(water => water.uid === userData.water);
    newWaterWerkingnaam.value = selectedWater ? selectedWater.werkingnaam : '';

  } catch (error) {
    console.error('Fout bij het ophalen van gebruikersgegevens:', error);
  }
});
</script>

<style scoped>

.settings {
  display: flex;
  flex-direction: column;
  align-items: center; 
  height: 60vh; 
}

button {
  margin-top: 1em;
  width:60vw;
}


</style>
