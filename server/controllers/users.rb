post '/users' do
	response['Access-Control-Allow-Origin'] = '*'

	user = User.create(params[:user])

	if user.errors.empty?
		object = {user: user}.to_json
	else
		object = {error: "There appears to have been an error creating a new user profile."}.to_json
	end
	content_type :json
	object
end
