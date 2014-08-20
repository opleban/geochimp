class Question < ActiveRecord::Base
  belongs_to :survey
  has_many :responses
  # Remember to create a migration!
end
