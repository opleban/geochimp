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
    case("survey"):
      getSurveyQuestionsAndResponses(e);
      break;
    case("question"):
      showResponses(e);
      break;
    case("user"):
      break;
  }
}


if ($('#map'))
  initializeMap()

function getAndShowResponses(e){
  ajaxRequest = $.ajax({
    url: "/questions/"+ e.target.attr("id")+"/responses",
    type: 'get'
  }).done(mapResponses)

  function mapResponses(data){
    parseResponses(data);
    placeResponsesOnMap;
    function parseResponses(data){

    }
  }
}

function getSurveyQuestions(e){
  ajaxRequest = $.ajax({
    url: "/surveys/" + e.target.attr("id"),
    type: 'get'
  }).done(function(data){
    $("#questions_container").empty();
    $("#questions_container").append(data.questions_html);
  }
}


// L.marker([37.78, -122.40]).addTo(map)
//     .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
//     .openPopup();