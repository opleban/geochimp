require_relative '../spec/factories'
3.times {
  user = FactoryGirl.create :user
  rand(6).times {
    survey = FactoryGirl.create :survey, :user => user
      rand(10).times{
        question = FactoryGirl.create :question, :survey => survey
      rand(50).times {
        FactoryGirl.create :response, :user => user, :question => question
      }
    }
  }
}
