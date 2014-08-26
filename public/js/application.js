function Survey(info){
  this.title = info.title;
  this.created_at = info.created_at;
  this.questions = [];
};

Survey.prototype = {
  getQuestions: function(questions){
    for(var i=0; i<questions.length; i++){
      var question = new Question(questions[i].content, questions.created_at, responses);
      question.responses = question.getResponses(questions[i].responses)
      this.questions.push(question);
    }
  }
};

function Question(info){
  this.content = info.content;
  this.responses = [];
  this.created_at = info.created_at;
};

Question.prototype = {
  getResponses: function(responses){
    for (var i=0; i<responses.length; i++){
      var user = User.new(responses[i].user);
      this.responses.push(new Response(responses[i].content, responses.created_at, user));
    }
  }
};

function Response(info){
  this.user = info.user;
  this.response = info.response;
  this.created_at = info.created_at;
};

function User(info){
  this.name = info.name;
  this.address = info.address;
  this.gender = info.gender;
  this.username = info.username;
  this.email = info.email;
  this.longitude = info.longitude;
  this.latitude = info.latitude;
};



// +++++++++++++++++++++++++++++++++++++


function View(){
}

View.prototype = {
  renderResponses: function(data){
    $("#responses_container").empty();
    $("#responses_container").append(data.responses_html)
  },

  changeSurveyButton: function(e){
    $(".survey").removeClass("current");
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

  getSurveyData: function(e){
    this.view.changeSurveyButton(e);
    this.retrieveSurveyData(e);
  },

  retrieveSurveyData: function(e){
    var ajaxRequest = $.ajax({
      url: "/surveys/" + $(e.target).attr("id"),
      type: "get"
    }).
    done(function(data){
      this.assignDataToModel(data);
      this.view.renderQuestions();
    }.bind(this))
  },

  assignDataToModel: function(data){
    this.survey = new Survey(data.survey.title, data.survey.created_at)
    this.survey.parseQuestions(data)
  },

  getSurveyQuestions: function(e){
    this.retrieveQuestions(e);
    this.view.changeSurveyButton(e);
  },

  retrieveQuestions: function(e){
    var ajaxRequest = $.ajax({
      url:"/surveys/" + $(e.target).attr("id"),
      type: 'get'
    }).
    done(function(data){
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

