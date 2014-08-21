//+++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++

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

// +++++++++++++++++++++++++++++++++++++

function SurveyController(id){
  this.survey_id = id;
}

function Controller(){
}

Controller.prototype = {

  getSurveyQuestions: function(e){
    e.preventDefault();
    this.survey = new SurveyController(e.target);
    this.retrieveQuestions(e);
  },

  retrieveQuestions: function(e){
  var ajaxRequest = $.ajax({
    url:"/surveys/" + $(this.survey.survey_id).attr("id"),
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
      $('.question').on("click", retrieveResponses.bind(this));

      function retrieveResponses(e){
        ajaxRequest = $.ajax({
          url: "/questions/"+ $(e.target).attr("id")+"/responses",
          type: 'get'
        }).done(this.mapController.renderResponses);
      }
    }
  },

  bindEvents: function(){
    $('.survey').on("click", this.getSurveyQuestions.bind(this));
  },
};

// +++++++++++++++++++++++++++++++++++++++++

function MapController(){
};

MapController.prototype = {
  initializeMap: function(lat,longi){
    this.map = L.map('map').setView([lat, longi], 15);
  },

  setMapBoxTileLayer: function(){
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/opleban.j9j3a8jb/{z}/{x}/{y}.png',
      {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>', maxZoom: 18 }).addTo(this.map);
     },

  renderResponses: function(data){
    var responseMarkers = []
    for (i=0; i< data.responses.length; i++){
      var response = new Response(data.responses[i]);
      var popup = L.popup().setContent(response.name +"<br/>" + response.content + "<br/>" + response.address + "<br/>");
      responseMarkers.push(L.marker([response.latitude, response.longitude]).bindPopup(popup));
      }
    return responseMarkers;
  },

  renderMarkers: function(markers){
    L.layerGroup(markers).addTo(this.map);
  }
};

var controller = new Controller();
var mapController = new MapController();
mapController.initializeMap(37.782, -122.411);
mapController.setMapBoxTileLayer();
controller.mapController = mapController;
controller.bindEvents();

// L.marker([37.78, -122.40]).addTo(map)
//     .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
//     .openPopup();