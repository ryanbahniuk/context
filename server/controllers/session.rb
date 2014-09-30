post '/login' do
	response['Access-Control-Allow-Origin'] = '*'

	user = User.find_by(email: params[:email])

	if user && user.authenticate(params[:password])
		# object = {user: {id: user.id, name: user.name, email: user.email}}.to_json
    encrypted = Encryptor.encrypt(user.id.to_s, key: SECRET_KEY)
    encoded = Base64.encode64(encrypted).encode('utf-8')
    object = {cookie: encoded}.to_json
	else
		object = {error: "Username or password did not match."}.to_json
	end
	content_type :json
	object
end
