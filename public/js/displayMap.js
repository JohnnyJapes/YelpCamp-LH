//mbxToken must be defined in using ejs template
mapboxgl.accessToken = mbxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: ( coordinates || [-74.5, 40]), // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl())
const mark = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup()
        .setHTML("<h5>"+campTitle.innerText+"</h5>")) // add popup
    .addTo(map)
