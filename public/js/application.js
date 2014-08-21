function Survey(id){
  this.survey_id = id;
}

Survey.prototype = {
  retrieveQuestions: function(e){
    var ajaxRequest = $.ajax({
      url:"/surveys/" + $(this.survey_id).attr("id"),
      type: 'get'
    }).done(function(data){
      renderQuestions(data);
      attachQuestionEventHandler();
    });

    function renderQuestions(data){
      $("#questions_container").empty();
      $("#questions_container").append(data.questions_html);
    }
    function attachQuestionEventHandler(){
      $('.question').on("click", retrieveResponses);

      function retrieveResponses(){
        ajaxRequest = $.ajax({
          url: "/questions/"+ $(this).attr("id")+"/responses",
          type: 'get'
        }).done(renderResponses);

        function renderResponses(data){
          var currentResponses = []
          for (i=0; i< data.responses.length; i++){
            var response = new Response(data.responses[i]);
            var popup = L.popup().setContent(response.name +"<br/>" + response.content + "<br/>" + response.address + "<br/>");
            currentResponses.push(L.marker([response.latitude, response.longitude]).bindPopup(popup));
            console.log(currentResponses);
          }
          L.layerGroup(currentResponses).addTo(controller.map);
        }
      }
    }
  }
}

function Response(info){
  this.name = info.user.name;
  this.address = info.user.address;
  this.gender = info.user.gender;
  this.username = info.user.username;
  this.email = info.user.email;
  this.content = info.response.content;
  this.longitude = info.user.longitude;
  this.latitude = info.user.latitude;
}


function Controller(){
  if $('#map')
    Controller.map_model = Map();
}

Controller.prototype.bindEvents = function(){
  $('.survey').on("click", function(e){
    var survey = new Survey(e.target);
    survey.retrieveQuestions();
  });
};

function Map(){
  this.map = initializeMap();
}

Map.prototype = {
  createResponsePins: function(){

  }
}


function initializeMap(){
  var map = L.map('map').setView([37.782, -122.411], 15);
  L.tileLayer('http://{s}.tiles.mapbox.com/v3/opleban.j9j3a8jb/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
  }).addTo(map);
  return map;
}

controller = new Controller();
controller.bindEvents();

// L.marker([37.78, -122.40]).addTo(map)
//     .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
//     .openPopup();