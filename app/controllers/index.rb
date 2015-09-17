get '/' do
	@trips = Bart.get_schedule("ftvl","powl",2)
	erb :index
end

get '/search_track' do
	p params[:query]
	content_type :json
	SoundcloudApi.search_track("#{params[:query]}").to_json
end

get '/spotify' do 
	# p artists = RSpotify::Artist.search('Arctic Monkeys')
	Spotify.oauth_client
	erb :spotify
end

get '/auth/spotify/callback' do

end