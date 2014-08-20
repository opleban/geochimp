// MVP
//   show survey result page with mapped respondent data
// initialize map
function initializeMap(){
  var map = L.map('map', { zoomControl:false }).setView([37.78, -122.40], 15);
  var googleLayer = new L.Google("ROADMAP");
  map.addLayer(googleLayer);

}

function bindEvents() {
  $('body').on("click", eventDelegator);
}

function eventDelegator(e){
  e.preventDefault();
  var $target = $(e.target);
  switch($target.attr("class")){
    case("question"):
    getResponses(e);
    break;
    case("user"):
    deleteTodo(e);
    break;
  }
}


if ($('#map'))
  initializeMap()

// function getResponses(e){
//   ajaxRequest = $.ajax({
//     url: "/questions/"+ e.target.attr("id")+/responses"",
//   })
// }


// L.marker([37.78, -122.40]).addTo(map)
//     .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
//     .openPopup();