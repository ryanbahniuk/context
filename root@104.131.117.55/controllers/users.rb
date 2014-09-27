post '/users' do
	if request.xhr?
		user = User.create(params[:user])

		if user.errors.empty?
			content_type :json
			return {user: user}.to_json
		else
			content_type :json
			return {error: "There appears to have been an error creating a new user profile."}.to_json
		end
	else
		return {error: "Request not allowed."}.to_json
	end
end
