post '/login' do
	response['Access-Control-Allow-Origin'] = '*'

	user = User.find_by(email: params[:email])

	if user && user.authenticate(params[:password])
		object = {user: user}.to_json
	else
		object = {error: "Username or password did not match."}.to_json
	end
	content_type :json
	object
end
