// console.log('Hello from the client side!');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

// create a new Leaflet map centered at a specific location
var mymap = L.map('map', {
  center: [34.111745, -118.113491],
  zoom: 13,
  zoomControl: false,
  scrollWheelZoom: false
});

// add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(mymap);

// add a marker to the map
// var marker = L.marker([51.5, -0.09]).addTo(mymap);

// var southWest = L.latLng(40.712, -74.227);
// var northEast = L.latLng(40.774, -74.125);
var bounds = L.latLngBounds();

var pinIcon = L.icon({
  iconUrl: '/img/pin.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35]
});

// Define an empty LatLngBounds object to store the bounds of the markers
var bounds = L.latLngBounds();

// Loop through the locations array
locations.forEach(function(loc) {
  // Create a custom div element for the marker
  let el = document.createElement('div');
  el.className = 'marker';

  // Create the marker with the custom div icon
  let marker = L.marker([loc.coordinates[1], loc.coordinates[0]], {
    icon: L.divIcon({
      html: el,
      className: 'marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    })
  }).addTo(mymap);

  // Create a new popup object
  let popup = L.popup().setContent(`<p>Day ${loc.day}: ${loc.description}</p>`);

  marker.bindPopup(popup);

  // Open popup
  popup.openPopup();
  // Extend the bounds to include the marker location
  bounds.extend(marker.getLatLng());
});

// Fit the map bounds to contain all the markers
mymap.fitBounds(bounds),
  {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100
    }
  };
