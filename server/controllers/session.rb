post '/login' do
	if request.xhr?
		user = User.find_by(username: params[:user][:username])

		if user && user.authenticate(params[:user][:password])
			content_type :json
			return {user: user}.to_json
		else
			content_type :json
			return {error: "Username or password did not match."}.to_json
		end
	else
		return {error: "Request not allowed."}.to_json
	end
end
