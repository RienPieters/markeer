// fetchData.js
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Fetch checkups data
export const fetchCheckups = async () => {
    try {
      const firestore = getFirestore();
      const checkupsCollection = collection(firestore, 'checkups');
      const querySnapshot = await getDocs(checkupsCollection);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { uid: doc.id, ...data }; // Include the document UID
      });
    } catch (error) {
      console.error('Error fetching checkups:', error);
      throw error;
    }
};

// Fetch waters data
export const fetchWaters = async () => {
    try {
      const firestore = getFirestore();
      const waterCollection = collection(firestore, 'waters');
      const waterSnapshot = await getDocs(waterCollection);
      return waterSnapshot.docs.map(doc => {
        const data = doc.data();
        return { uid: doc.id, ...data }; // Include the document UID
      });
    } catch (error) {
      console.error('Error fetching waters:', error);
      throw error;
    }
  };
  

// Fetch user data
export const fetchUserData = async (userId) => {
    try {
      const firestore = getFirestore();
      const userCollection = collection(firestore, 'users');
      const userDocRef = doc(userCollection, userId);
      const userSnapshot = await getDoc(userDocRef);
      return userSnapshot.exists() ? userSnapshot.data() : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
};

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
