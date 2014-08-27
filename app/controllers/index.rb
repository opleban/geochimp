get '/' do

  erb :sign_in
  #login page
  #graphic
end

get '/geocode' do
  coordinates = HereGeocoder::Class.new().geocode(params[:address]) if params[:address]
  content_type :json
  coordinates
end

get '/users/:id' do
  @surveys = Survey.all
  erb :map_view
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
  survey = Survey.find(params[:id])
  questions = survey.questions.to_a.map do |question|
    responses = question.responses.map do |response|
      {content: response.content,created_at: response.created_at, id:response.id, user: response.user}
    end
    {content:question.content, created_at:question.created_at, id:question.id, responses:responses}
  end
  content_type :json
  {survey: survey, questions:questions}.to_json
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

# get "/questions/:id/responses" do
#   question = Question.find(params[:id])
#   responses = question.responses
#   @responses_and_respondents = responses.map{ |response| {user:response.user, response:response} }
#   responses_html = erb :response_list, :layout => false
#   content_type :json
#   {question:question, responses_html:responses_html, responses:@responses_and_respondents}.to_json
# end
