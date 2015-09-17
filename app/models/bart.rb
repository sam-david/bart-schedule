module Bart
	def self.get_schedule(origin,destination,hours_ahead)
		#Retrieves bart schedule for n hours_ahead
		starting_time = Time.now
		ending_time = Time.now + (hours_ahead*60*60)
		trip_array = []
		while starting_time < ending_time
			bart_uri = URI.parse('http://api.bart.gov/api/sched.aspx?')
			# b: How many trips before specified time (max 4), a: How many trips after specified time (max 4)
			params = {:cmd => "depart" ,:orig => origin, :dest => destination , :date => 'now', :time => starting_time.strftime('%I:%M%p'), :key => 'MW9S-E7SL-26DU-VV8V', :b => '0', :a => '4'}
			# Add params to URI
			bart_uri.query = URI.encode_www_form( params )
			# xml_doc = url.open.read
			doc = Nokogiri::XML(open(bart_uri))
			trips = doc.css('trip')
			time_span = 0
			trips.each do |trip|
				trip_route_number = trip.children[0].attributes['line'].value.scan(/\d+/).first
				trip_origin = trip.attribute('origin').value
				trip_destination = trip.attribute('destination').value
				trip_fare = trip.attribute('fare').value
				trip_origin_time = trip.attribute('origTimeMin').value
				trip_destination_time = trip.attribute('destTimeMin').value
				# p trip.attribute('line')
				current_trip = Trip.new({origin: trip_origin, destination: trip_destination, fare: trip_fare, origin_time: trip_origin_time, destination_time: trip_destination_time})
				current_trip.route = get_route(trip_route_number)
				# p trip_array.any? {|trip| trip[:origin_time]}
				trip_array << current_trip
			end
			last_time = Time.parse(trip_array.last.origin_time)
			time_difference = Time.parse(trip_array.last.origin_time) - starting_time
			starting_time = starting_time + time_difference + 100
		end
		trip_array.each do |trip|
			p trip.origin_time
			p trip
		end
	end
	def self.get_route(number)
		bart_uri = URI.parse('http://api.bart.gov/api/route.aspx?')
		params = {:cmd => "routeinfo" ,:route => number, :key => 'MW9S-E7SL-26DU-VV8V'}
		# Add params to URI
		bart_uri.query = URI.encode_www_form( params )
		# xml_doc = url.open.read

		doc = Nokogiri::XML(open(bart_uri))

		route_name = doc.css('name').children.text
		route_abbr_name = doc.css('abbr').children.text
		route_stations_count = doc.css('num_stns').children.text
		route_color = doc.css('color').children.text

		return Route.new({name: route_name, abbr_name: route_abbr_name, stations_count: route_stations_count, color_code: route_color})
	end
end
