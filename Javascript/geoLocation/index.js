const pos = navigator.geolocation.watchPosition(success);
const lat = document.querySelector("#lat");
const lon = document.querySelector("#lon");

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  lat.value = latitude;
  lon.value = longitude;
}
