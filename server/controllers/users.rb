post '/users' do
	if request.xhr?
		user = User.create(params[:user])

		if user.errors.empty?
			content_type :json
			{user: user}.to_json
		else
			content_type :json
			{error: "There appears to have been an error creating a new user profile."}.to_json
		end
	else
		"Request not allowed."
	end
end
