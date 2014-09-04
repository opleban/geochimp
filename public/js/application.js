// MVP
// Move more functionality into the models
// pub/sub pattern radio.js
function Survey(survey_info){
  this.title = survey_info.title;
  this.created_at = survey_info.created_at;
  this.questions = [];
};

Survey.prototype = {
  parseSurveyData: function(data){
    for(var i=0; i<data.questions.length; i++){
      var question_data = data.questions[i];
      var question = new Question({content: question_data.content, created_at:question_data.created_at, id: question_data.id});
      question.getResponses(question_data.responses);
      this.questions.push(question);
    }
  },

  findQuestionById: function(id){
    for (var i=0; i< this.questions.length; i++){
      if (this.questions[i].id == id){
        return this.questions[i];
      }
    }
  }
};


function Question(data){
  this.content = data.content;
  this.created_at = data.created_at;
  this.id = data.id
  this.responses = [];
};

Question.prototype = {
  getResponses: function(responses){
    for (var i=0; i<responses.length; i++){
      var responder = new User(responses[i].user);
      this.responses.push(new Response({content:responses[i].content, created_at:responses[i].created_at, user:responder, id:responses[i].id}));
    }
  },
};

function Response(response_info){
  this.user = response_info.user;
  this.id = response_info.id
  this.content = response_info.content;
  this.created_at = response_info.created_at;
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

  renderResponses: function(responses_data){
    var responseListTemplate = $("#response-list-template").html();
    var compiledTemplate = doT.template(responseListTemplate)
    var responseList = compiledTemplate({responses:responses_data});
    $("#responses_container").empty();
    $("#responses_container").html(responseList);
  },

  changeSurveyButton: function(e){
    $(".survey").removeClass("current");
    $(e.target).addClass("current");
  },

  changeQuestionButton: function(e){
    $(".question").removeClass("current");
    $(e.target).addClass("current");
  },

  renderQuestions: function(questions_data){
    var questionListTemplate = $("#question-list-template").html();
    var compiledTemplate = doT.template(questionListTemplate)
    var questionList = compiledTemplate({questions:questions_data});
    $("#questions_container").empty();
    $("#responses_container").empty();
    $("#questions_container").html(questionList);
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

  bindEvents: function(){
    $('.survey').on("click", this.retrieveSurveyData.bind(this));
  },

  retrieveSurveyData: function(e){
    var ajaxRequest = $.ajax({
      url: "/surveys/" + $(e.target).attr("id"),
      type: "get"
    }).
    done(function(data){
      this.view.changeSurveyButton(e);
      this.mapController.clearExistingMarkers();
      this.assignDataToModel(data);
      this.view.renderQuestions(this.survey.questions);
      this.attachQuestionEventHandler(); // move to question model
    }.bind(this))
    // Add error handling
  },

  assignDataToModel: function(data){
    this.survey = new Survey({title:data.survey.title, created_at:data.survey.created_at})
    this.survey.parseSurveyData(data)
  },


  attachQuestionEventHandler: function(){
    $('.question').on("click", this.getResponses.bind(this));
  },

  getResponses: function(e){
    var question_id = $(e.target).attr("id")
    this.view.changeQuestionButton(e);
    var question = this.survey.findQuestionById(question_id);
    this.view.renderResponses(question.responses);
    this.mapController.renderResponsesOnMap(question.responses);
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

  createMarkers: function(responses){
    var responseMarkers = [];
    for (i=0; i< responses.length; i++){
      var response = responses[i];
      var popup = L.popup().setContent(response.user.name +"<br/>" + response.content + "<br/>" + response.user.address + "<br/>");
      var marker = L.marker([response.user.latitude, response.user.longitude]).bindPopup(popup);
      marker.marker_id = "response-" + response.id;
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
    $('.response_list').on("click", this.displayPopUp.bind(this));
  },

  clearExistingMarkers: function(){
    if (this.responseLayer)
      this.map.removeLayer(this.responseLayer);
  },

  displayPopUp: function(e){
    var marker_id = $(e.target).attr("id");
    for (var marker in this.responseLayer._layers){
      console.log(this.responseLayer._layers[marker]);
      if (marker_id === this.responseLayer._layers[marker].marker_id)
        this.responseLayer._layers[marker].openPopup();
    }
  }
};

controller = new Controller();


