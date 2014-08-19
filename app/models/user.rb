class User < ActiveRecord::Base
  belongs_to :region
  has_many :surveys



end
