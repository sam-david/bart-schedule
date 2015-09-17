class Trip
	attr_reader :origin_time, :origin, :destination, :fare, :destination_time
	attr_accessor :route
	def initialize(params = {})
		@origin = params[:origin]
		@destination = params[:destination]
		@fare = params[:fare]
		@origin_time = params[:origin_time]
		@destination_time = params[:destination_time]
	end
end