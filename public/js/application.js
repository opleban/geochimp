// MVP
//   show survey result page with mapped respondent data
// initialize map
function initializeMap(){
  L.map('map').setView([37.78, -122.40], 15);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
      contributors'}).addTo(map);
}

function getRespondents(){
  ajaxRequest = $.ajax({
    url: ""
  })
}


L.marker([37.78, -122.40]).addTo(map)
    .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
    .openPopup();