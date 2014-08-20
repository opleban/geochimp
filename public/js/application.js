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
  console.log(e);
  var $target = $(e.target);

  switch($target.attr("class")){
    case("survey"):
    getSurveyQuestions(e);
    break;
    case("question"):
    getAndshowResponses(e);
    break;
    case("user"):
    break;
  }

  function getAndShowResponses(e){
    ajaxRequest = $.ajax({
      url: "/questions/"+ e.target.attr("id")+"/responses",
      type: 'get'
    }).done(renderResponses);

    function renderResponses(data){
      var parsedData = parseResponses(data);
      mapResponsesOnMap(parsedData);

      function parseResponses(data){
        console.log(data);
      }
    }
  }
    function getSurveyQuestions(e){
      var ajaxRequest = $.ajax({
        url:"/surveys/" + $(e.target).attr("id"),
        type: 'get'
      }).done(function(data){
        $("#questions_container").empty();
        $("#questions_container").append(data.questions_html);
      });
    }
  }



if ($('#map')){
  bindEvents();
  initializeMap();
}

// L.marker([37.78, -122.40]).addTo(map)
//     .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
//     .openPopup();