import mapboxgl from 'mapbox-gl';
import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { getCurrentUser } from '@/_helpers/auth';
import { addMarkersToMap, removeMarkerFromMap } from './markers';
import { addedMapMarkers } from './markers';

// Set up geolocation functionality on the map
export async function setupGeolocation(map) {
  if ('geolocation' in navigator) {
    try {
      // Create a geolocation control and add it to the map
      let geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });
      map.addControl(geolocate);

      // Trigger geolocation once the map is idle
      map.once('idle', () => {
        geolocate.trigger();
      });

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        });
      });

      map.setCenter([position.coords.longitude, position.coords.latitude]);

    } catch (error) {
      console.error('Geolocation error:', error);
    }
  } else {
    console.log('Geolocation not available');
  }
}

export async function setupSnapshotListener(map, markers) {
  try {
    const firestore = getFirestore();
    const currentUser = await getCurrentUser();
    const userRef = doc(firestore, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const checkupCollection = collection(firestore, 'checkups');

    // Create an array to hold the current markers
    const currentMarkers = [];

    const unsubscribe = onSnapshot(checkupCollection, (snapshot) => {
      const updatedMarkers = [];

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const checkupDoc = change.doc;
          const checkupMarkers = checkupDoc.data().markers || {};
          const checkupWater = checkupDoc.data().water;

          // Filter and map markers based on user's water and "not solved" status
          const filteredMarkers = Object.entries(checkupMarkers)
            .filter(([key, marker]) => checkupWater === userData.water && !marker.solved)
            .map(([key, marker]) => ({
              ...marker,
              key,
            }));

          updatedMarkers.push(...filteredMarkers);
        }
      });

      // Remove markers that are not present in the updated markers
      currentMarkers.forEach((marker) => {
        if (!updatedMarkers.some((updatedMarker) => updatedMarker.key === marker.key)) {
          removeMarkerFromMap(marker);
        }
      });

      // Add new markers to the map and update currentMarkers
      updatedMarkers.forEach((marker) => {
        if (!addedMapMarkers.has(marker.key)) {
          addMarkersToMap(mapboxgl, map, [marker], markAsSolved);
          currentMarkers.push(marker);
        }
      });
    });

    return unsubscribe;

  } catch (error) {
    console.error('Snapshot listener error:', error);
  }
}

// Mark a marker as solved in Firestore
export async function markAsSolved(marker) {
  try {
    const firestore = getFirestore();
    const checkupCollection = collection(firestore, 'checkups');
    const querySnapshot = await getDocs(checkupCollection);

    // Iterate through checkup documents to find the marker
    for (const checkupDoc of querySnapshot.docs) {
      const checkupData = checkupDoc.data();
      const markersObject = checkupData.markers || {};

      // Find the marker by its key in the markers object
      const markerKey = Object.keys(markersObject).find((key) => key === marker.key);

      if (markerKey) {
        // Update marker's "solved" status
        markersObject[markerKey].solved = true;

        // Update Firestore document with the updated markers object
        const markerRef = doc(firestore, 'checkups', checkupDoc.id);
        await updateDoc(markerRef, { markers: markersObject });

        // Exit the loop since the marker is found and updated
        break;
      }
    }
  } catch (error) {
    console.error('Error marking marker as solved in Firestore:', error);
  }
}

