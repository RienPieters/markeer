<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Naam</th>
          <th>Goedgekeurd</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.uid" @click="showUserDetails(user)">
          <td>{{ user.name }}</td>
          <td>{{ user.approved ? 'Ja' : 'Nee' }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedUser" class="modal">
      <div class="modal-content">
        <button class="close-button" @click="closeUserDetails">&times;</button>
        <UserDetails :user="selectedUser" @userDeleted="handleUserDeleted"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UserDetails from './UserDetails.vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const users = ref([]);
const selectedUser = ref(null);

const fetchUsers = async () => {
  const firestore = getFirestore();
  const userCollection = collection(firestore, 'users');
  const userSnapshot = await getDocs(userCollection);
  const userList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  userList.sort((a, b) => a.name.localeCompare(b.name));
  return userList;
};

onMounted(async () => {
  users.value = await fetchUsers();
});

const handleUserDeleted = (userId) => {
  users.value = users.value.filter((user) => user.id !== userId);
  closeUserDetails();
};


const showUserDetails = (user) => {
  selectedUser.value = user;
};

const closeUserDetails = () => {
  selectedUser.value = null;
};
</script>

<style scoped>

</style>
 
