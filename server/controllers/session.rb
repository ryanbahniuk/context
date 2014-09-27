post '/login' do
	if request.xhr?
		user = User.find_by(username: params[:user][:username])

		if user && user.authenticate(params[:user][:password])
			content_type :json
			{user: user}.to_json
		else
			content_type :json
			{error: "Username or password did not match."}.to_json
		end
	else
		"Request not allowed."
	end
end
