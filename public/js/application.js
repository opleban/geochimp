
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
  this.response_id = info.response.id;
}

// +++++++++++++++++++++++++++++++++++++

function SurveyViewControl(id){
  this.surveyId = id;
}

function Controller(){
}

Controller.prototype = {

  getSurveyQuestions: function(e){
    e.preventDefault();
    $(".survey").removeClass("current");
    $(e.target).addClass("current");
    this.surveyView = new SurveyViewControl(e.target);
    this.retrieveQuestions(e);
  },

  renderResponses: function(data){
    $("#responses_container").empty();
    $("#responses_container").append(data.responses_html)
    $('.response').on("click", this.showMarker.bind(this));
    this.mapController.renderResponsesOnMap(data);
  },

  retrieveQuestions: function(e){
    var ajaxRequest = $.ajax({
      url:"/surveys/" + $(this.surveyView.surveyId).attr("id"),
      type: 'get'
    }).done(function(data){
      renderQuestions(data);
      attachQuestionEventHandler();
    });

    function renderQuestions(data){
      $("#responses_container").empty();
      $("#questions_container").empty();
      $("#questions_container").append(data.questions_html);
    }

    function attachQuestionEventHandler(){
      $('.question').on("click", retrieveResponses.bind(this));

      function retrieveResponses(e){
        $(".question").removeClass("current");
        $(e.target).addClass("current");
        var ajaxRequest = $.ajax({
          url: "/questions/"+ $(e.target).attr("id")+"/responses",
          type: 'get'
        }).done(this.controller.renderResponses.bind(this.controller));
      }
    }
  },

  showMarker: function(e){
    $(".response").removeClass("current");
    $(e.target).addClass("current");
    // this.mapController.centerMapOnResponse(e);
  },

  bindEvents: function(){
    $('.survey').on("click", this.getSurveyQuestions.bind(this));
  },
};

// +++++++++++++++++++++++++++++++++++++++++

function MapController(){
};

MapController.prototype = {
  initializeMap: function(lat,longi, zoom){
    this.map = L.map('map').setView([lat, longi], zoom);
  },

  setMapBoxTileLayer: function(){
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/opleban.j9j3a8jb/{z}/{x}/{y}.png',
      {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>', maxZoom: 18 }).addTo(this.map);
     },
  setEsriTileLayer: function(){
    L.esri.basemapLayer("Imagery").addTo(this.map);
  },

  createMarkers: function(data){
    var responseMarkers = [];
    for (i=0; i< data.responses.length; i++){
      var response = new Response(data.responses[i]);
      var popup = L.popup().setContent(response.name +"<br/>" + response.content + "<br/>" + response.address + "<br/>");
      var marker = L.marker([response.latitude, response.longitude]).bindPopup(popup);
      $("#response-"+response.response_id).on("click", function(e){
        marker.togglePopup()
      });
      responseMarkers.push(marker);
    }
    return responseMarkers;
  },

  renderMarkers: function(markers){
    if (this.responseLayer)
      this.clearExistingMarkers();
    this.responseLayer = L.layerGroup(markers);
    this.responseLayer.addTo(this.map);
  },

  clearExistingMarkers: function(){
    this.map.removeLayer(this.responseLayer);
  },

  renderResponsesOnMap: function(data){
    var markers = this.createMarkers(data);
    this.renderMarkers(markers);
  },

  onMapClick:function(e){
    var popup = L.popup();
    popup.setLatLng(e.latlng)
    popup.setContent("You clicked the map at" + e.latlng.toString())
    popup.openOn(this);
  },

  bindEvents:function(){
    this.map.on('click', this.onMapClick);
  }
};

var controller = new Controller();
var mapController = new MapController();
mapController.initializeMap(34.06543, -4.96194, 15);
// mapController.setMapBoxTileLayer();
mapController.setEsriTileLayer();
controller.mapController = mapController;
controller.bindEvents();
controller.mapController.bindEvents();
