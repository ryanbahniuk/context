post '/error' do
  response['Access-Control-Allow-Origin'] = '*'

  url_id = Url.rootify_find_create(params[:url]).id
  if params[:user_id]
    decoded = Base64.decode64(params[:user_id].encode('ascii-8bit'))
    decrypted = Encryptor.decrypt(decoded, key: SECRET_KEY)
    params[:user_id] = decrypted
  else
    params[:user_id] = nil
  end
  error = PageError.create(url_id: url_id, user_id: params[:user_id], os: params[:os], type: params[:type], description: params[:description])

  content_type :text
  "#{error.id}"
end

post '/error/:id' do
  response['Access-Control-Allow-Origin'] = '*'
  error = PageError.find_by_id(params[:id])
  if error
    error.update(description: params[:description])
    content_type :text
    "Added description to #{error.id}"
  else
    "Could not find this error"
  end
end
