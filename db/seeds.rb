require_relative '../spec/factories'
1.times{
  user = FactoryGirl.create :user
  10.times {
    survey = FactoryGirl.create :survey, :user => user
    5.times{
      question = FactoryGirl.create :question, :survey => survey
      20.times{
        user = FactoryGirl.create :user
        FactoryGirl.create :response, :user => user, :question => question
      }
    }
  }
}
