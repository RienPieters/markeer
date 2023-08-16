<template>
  <div class="container">
    <h1>Registreren</h1>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="text" id="email" placeholder="Email" v-model="email">
    </div>
    <div class="form-group">
      <label for="firstName">Voornaam</label>
      <input type="text" id="firstName" placeholder="Voornaam" v-model="firstName">
    </div>
    <div class="form-group">
      <label for="lastName">Achternaam</label>
      <input type="text" id="lastName" placeholder="Achternaam" v-model="lastName">
    </div>
    <div class="form-group">
      <label for="password">Wachtwoord</label>
      <input type="password" id="password" placeholder="Wachtwoord" v-model="password">
    </div>
    <div class="form-group">
      <label for="selectedWater">Waterwerking</label>
      <select v-model="selectedWater">
        <option :value="null" disabled>Selecteer waterwerking</option>
        <option
          v-for="water in sortedWaters"
          :value="water.uid"
          :key="water.uid"
        >{{ water.werkingnaam }}</option>
      </select>
    </div>
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    <button class="primary" @click="register">Registreren</button>
    <p style="font-size: 13px;">Heb je al een account? <router-link class="tertiary" to="/login">Log hier in!</router-link></p>
  </div>
  
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase/init';

const email = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const selectedWater = ref(null);
const errorMsg = ref('');
const router = useRouter();
const watersData = ref([]);

const fetchWaters = async () => {
  const firestore = getFirestore();
  const waterCollection = collection(firestore, 'waters');
  const waterSnapshot = await getDocs(waterCollection);
  return waterSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
};

onMounted(async () => {
  watersData.value = await fetchWaters();
});

const sortedWaters = computed(() =>
  watersData.value
    .filter(water => water.status === 'actief')
    .sort((a, b) => a.werkingnaam.localeCompare(b.werkingnaam))
);

const errorMessages = {
  'auth/invalid-email': 'Ongeldige email',
  'auth/user-not-found': 'Gebruiker niet gevonden',
  'auth/wrong-password': 'Ongeldig wachtwoord',
  'auth/email-already-in-use': 'E-mailadres is al in gebruik',
  'auth/weak-password': 'Zwak wachtwoord',
  default: 'Er is iets fout gegaan',
};

const register = async () => {
  try {
    if (!selectedWater.value) {
      errorMsg.value = 'Selecteer een waterwerking voordat u zich registreert.';
      return;
    }
    const firestore = getFirestore();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const { user } = userCredential;

    const userCollection = collection(firestore, 'users');
    const userDocRef = doc(userCollection, user.uid);

    await setDoc(userDocRef, {
      email: user.email,
      name: `${firstName.value} ${lastName.value}`,
      water: selectedWater.value,
      role: 'steward',
      approved: false,
    });

    router.push({ name: 'Home' });
  } catch (error) {
    errorMsg.value = errorMessages[error.code] || errorMessages.default;
  }
};
</script>

<style scoped>
.primary {
  margin: 1rem;
}

button {
  width:60vw;
}
</style>
