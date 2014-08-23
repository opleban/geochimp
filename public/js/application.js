
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


function View(){
}

View.prototype = {
  renderResponses: function(data){
    $("#responses_container").empty();
    $("#responses_container").append(data.responses_html)
  },

  changeSurveyButton: function(e){
    $(".survey").removeClass("current"); // Move to View
    $(e.target).addClass("current");
  },

  changeQuestionButton: function(e){
    $(".question").removeClass("current");
    $(e.target).addClass("current");
  },

  renderQuestions: function(data){
    $("#responses_container").empty();
    $("#questions_container").empty();
    $("#questions_container").append(data.questions_html);
  }
}

function Controller(){
  this.view = new View();
  this.mapController = new MapController();
  this.mapController.initializeMap(34.06543, -4.96194, 15);
  this.mapController.setEsriTileLayer();
  this.bindEvents();
}

Controller.prototype = {

  getSurveyQuestions: function(e){
    this.view.changeSurveyButton(e);
    this.retrieveQuestions(e);
  },

  retrieveQuestions: function(e){
    var ajaxRequest = $.ajax({
      url:"/surveys/" + $(e.target).attr("id"),
      type: 'get'
    }).done(function(data){
      this.view.renderQuestions(data);
      this.attachQuestionEventHandler(data);
      }.bind(this));
  },

  attachQuestionEventHandler: function(){
    $('.question').on("click", this.retrieveResponses.bind(this));
  },

  retrieveResponses: function(e){
    this.view.changeQuestionButton(e);
    var ajaxRequest = $.ajax({
      url: "/questions/"+ $(e.target).attr("id")+"/responses",
      type: 'get'
    }).
    done(function(data){
      this.view.renderResponses(data);
      this.mapController.renderResponsesOnMap(data);
    }.bind(this));
  },

  bindEvents: function(){
    $('.survey').on("click", this.getSurveyQuestions.bind(this));
  }

  // showMarker: function(e){
  //   $(".response").removeClass("current");
  //   $(e.target).addClass("current");
  //   this.mapController.centerMapOnResponse(e);
  // },
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
      responseMarkers.push(marker);
    }
    return responseMarkers;
  },

  renderResponsesOnMap: function(data){
    var markers = this.createMarkers(data);
    this.renderMarkers(markers);
  },


  renderMarkers: function(markers){
    if (this.responseLayer)
      this.clearExistingMarkers();
    this.responseLayer = L.layerGroup(markers);
    this.responseLayer.addTo(this.map);
  },

  clearExistingMarkers: function(){
    this.map.removeLayer(this.responseLayer);
  }
};

controller = new Controller();
