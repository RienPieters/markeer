import { markerCode } from '@/lib/consts';

// Create a Set to track added map markers
export const addedMapMarkers = new Set();

// Function to add markers to the map
export function addMarkersToMap(mapboxgl, map, markers, markAsSolved) {
  markers.forEach((marker) => {
    if (!addedMapMarkers.has(marker.key)) {
      const markerDescription = markerCode.find((code) => Object.keys(code)[0] === marker.code)[marker.code];

      // Create an image element for the SVG icon
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
      });
      
      // Create content for the popup
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div>
          <strong>${markerDescription}</strong><br><br>
          <button class="mark-solved-button primary">Opgelost</button>
        </div>
      `;
      
      // Add click event listener to the "Mark as Solved" button
      popupContent.querySelector('.mark-solved-button').addEventListener('click', async () => {
        try {
          // Update Firestore and remove marker from Mapbox
          await markAsSolved(marker);
          if (marker.mapMarker) {
            marker.mapMarker.remove();
          }
        } catch (error) {
          console.error('Error marking as solved:', error);
        }
      });
      
      // Set the popup content
      popup.setDOMContent(popupContent);
      
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.style.width = '24px';
      markerElement.style.height = '24px';

      // Create an image element for the SVG icon
      const svgElement = new Image();
      svgElement.src = require('@/assets/markers/' + marker.code + '.svg');
      svgElement.onload = () => {
      markerElement.appendChild(svgElement);

      const mapMarker = new mapboxgl.Marker(markerElement)
      .setLngLat([marker.longitude, marker.latitude])
      .setPopup(popup)
      .addTo(map);

      // Store the marker and mark it as added
      marker.mapMarker = mapMarker;
      addedMapMarkers.add(marker.key);
      };
    }
  });
}

// Function to remove a marker from the map
export function removeMarkerFromMap(marker) {
  if (marker.mapMarker) {
    // Remove marker from the map and update the tracking Set
    marker.mapMarker.remove();
    addedMapMarkers.delete(marker.key);
    marker.mapMarker = null;
  }
}

export function resetMarkers() {
  addedMapMarkers.clear();
}
