import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const getUserRole = async (uid) => {
  const firestore = getFirestore();
  try {
    const userDocRef = doc(firestore, 'users', uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData.role || 'user';
    } else {
      return 'user';
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
};

const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(getAuth(), (user) => {
      removeListener();
      resolve(user);
    }, reject);
  });
  

const getUserApprovalStatus = async (uid) => {
  const firestore = getFirestore();

  try {
    const userDocRef = doc(firestore, 'users', uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData.approved || false;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error fetching user approval status:', error);
    return false;
  }
};

export { getUserRole, getCurrentUser, getUserApprovalStatus };
