post '/login' do
	response['Access-Control-Allow-Origin'] = '*'

	unless params[:version] == '0.0.6'
		content_type :json
		return {error: "Your version of Context is super old.  Time to upgrade to version 0.0.6."}.to_json
	end

	user = User.find_by(email: params[:email])

	if user && user.authenticate(params[:password])
		encrypted = Encryptor.encrypt(user.id.to_s, key: SECRET_KEY)
		encoded = Base64.encode64(encrypted).encode('utf-8')
		object = {cookie: encoded}.to_json
	else
		object = {error: "Username or password did not match."}.to_json
	end
	content_type :json
	object
end
