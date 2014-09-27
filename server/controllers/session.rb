post '/login' do
	response.header['Access-Control-Allow-Origin'] = '*'
	response.header['Access-Control-Request-Method'] = '*'

	user = User.find_by(email: params[:user][:email])

	# if user && user.authenticate(params[:user][:password])
	# 	content_type :json
	# 	return {user: user}.to_json
	# else
	# 	content_type :json
	# 	return {error: "Username or password did not match."}.to_json
	# end
	# content_type :json
	# return {error: "Request not allowed."}.to_json

	# content_type :json
	200
end
