require 'factory_girl'
require 'faker'

FactoryGirl.define do

  factory :user do
    username { Faker::Internet.user_name }
    password {Faker::Internet.password }
    email { Faker::Internet.email }
    name { Faker::Name.name }
    address {Faker::Address.street_address}
    longitude {Faker::Address.longitude}
    latitude {Faker::Address.latitude}
    phone_number {Faker::PhoneNumber.phone_number}
  end

  factory :survey do
    title { Faker::Lorem.word }
    user
  end

  factory :question do
    content { Faker::Lorem.sentence }
    survey
  end

  factory :response do
    content { Faker::Lorem.sentence }
    user
    question
  end

end
