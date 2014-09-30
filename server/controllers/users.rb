post '/users' do
	response['Access-Control-Allow-Origin'] = '*'

	user = User.create(params[:user])

	if user.errors.empty?
		object = {user: {id: user.id, name: user.name, email: user.email}}.to_json
	else
    puts user.errors
    error_string = ""
    user.errors.messages.each do |field, error|
      error_string << field.to_s + ": " + error.join(" ")
      error_string << "\n"
    end
    # object = {error: "There appears to have been an error creating a new user profile."}.to_json
		object = {error: error_string}.to_json
	end
	content_type :json
	object
end
