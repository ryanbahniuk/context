post '/users' do
  response['Access-Control-Allow-Origin'] = '*'

  unless params[:version] == '0.0.6'
    content_type :json
    return {error: "Your version of Context is super old. Time to upgrade to version 0.0.6."}.to_json
  end

  user = User.create(params[:user])

  if user.errors.empty?
    encrypted = Encryptor.encrypt(user.id.to_s, key: SECRET_KEY)
    encoded = Base64.encode64(encrypted).encode('utf-8')
    object = {cookie: encoded}.to_json
  else
    error_string = ""
    user.errors.messages.each do |field, error|
      error_string << field.to_s + ": " + error.join(" ")
      error_string << "\n"
    end
    # object = {error: "There appears to have been an error creating a new user profile."}.to_json
    object = {error: error_string}.to_json
  end
  content_type :json
  object
end
