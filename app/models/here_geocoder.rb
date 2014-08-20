module HereGeocoder

  class Client
    include HTTParty

    base_uri "http://geocoder.api.here.com"

    def initialize
    end

    def geocode(address)
      response = self.class.get("/6.2/geocode.json", :query => {:app_code => '7k7csC-k4fE4uxO4qjeW_Q', :app_id => 'KLDYwmaksNX4dmHUY0vf',:searchtext => address}, headers: {"User-Agent" => Test_App})
      JSON.parse(response.body)
    end

  end

end