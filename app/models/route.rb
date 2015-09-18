class Route
	attr_reader :name, :abbr_name, :stations_count, :color_code, :route_number
	def initialize(params = {})
		@name = params[:name]
		@abbr_name = params[:abbr_name]
		@route_number = params[:route_number]
		@stations_count = params[:stations_count]
		@color_code = params[:color_code]
	end
end