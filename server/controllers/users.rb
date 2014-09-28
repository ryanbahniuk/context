post '/users' do
	response['Access-Control-Allow-Origin'] = '*'

 # check whether user already exists
	user = User.create(params[:user])

	if user.errors.empty?
		object = {user: {id: user.id, name: user.name, email: user.email}}.to_json
	else
		object = {error: "There appears to have been an error creating a new user profile."}.to_json
	end
	content_type :json
	object
end
