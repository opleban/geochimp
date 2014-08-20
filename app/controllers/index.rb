get '/' do
  erb :index
  #login page
  #graphic
end

get '/geocode' do
  coordinates = HereGeocoder::Class.new().geocode(params[:address]) if params[:address]
  content_type :json
  coordinates
end

get '/users/:id' do
  #user profile view
  #view username and address
  #email
  #surveys
end


get "/surveys" do
  #list of all surveys
  #will provide a list of all surveys
end

get "/surveys/:id" do
  #individual survey
  #lists all questions in survey
end

get "/surveys/new" do
  #survey/poll creation page
  #will have form to add individual questions
  #will provide option to add and delete questions as you go, will instantiate questions but won't save them
  #will only save questions to the database upon confirmation
end

post "/surveys/new" do
  #create survey post route
end

delete "/surveys/:id/delete" do
  #will allow the option to delete a survey and all associated questions
end

get "/questions/:id/responses" do
  @questions = Question.find(params[:id])
  @responses =
end