<template>
  <div id="map" class="mapContainer" ref="mapContainer"></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { setupGeolocation } from '@/_helpers/mapUtils'
import { resetMarkers } from '@/_helpers/markers';
import { setupSnapshotListener } from '@/_helpers/mapUtils';

// Reference to the map container element
const mapContainer = ref(null);
// Initialize the map variable
let map = null;
// Initialize an array to hold markers
const markers = ref([]);

// Hook: Called when the component is mounted
onMounted(async () => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicmllbnBpZXRlcnMiLCJhIjoiY2xqeWc3MTJ1MDUyMTNvbGg3NnNsMTd6MSJ9.z5WeAerihBq4frNI7NTS1A';

  // Create a new map instance
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    attributionControl: false,
    zoom: 15,
  });

  resetMarkers();

  await setupSnapshotListener(map, markers);

  await setupGeolocation(map, markers);
});


onBeforeUnmount(() => {
  markers.value = [];
});

</script>

<style scoped>
#map {
  height: calc(100vh - 48px);
}
.marker {
  z-index: 1001;
}
.mapboxgl-popup {
  z-index: 1002;
}

/* Reaching the child elements of the geolocation control */
:deep(.mapboxgl-ctrl-geolocate) {
  width: 40px;
  height: 40px;
}

:deep(.mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon) {
  width: 40px;
  height: 40px;
}
body {
  overflow: hidden;
}
</style>
