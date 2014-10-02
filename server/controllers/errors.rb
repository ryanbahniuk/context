post '/error' do
  response['Access-Control-Allow-Origin'] = '*'
  puts "did i get here?"
  if params[:url]
    url_id = Url.rootify_find_create(params[:url]).id
  end

  if params[:user_id]
    begin
      decoded = Base64.decode64(params[:user_id].encode('ascii-8bit'))
      decrypted = Encryptor.decrypt(decoded, key: SECRET_KEY)
      params[:user_id] = decrypted
    rescue
      params[:user_id] = nil
    end
  else
    params[:user_id] = nil
  end
  error = PageError.create(url_id: url_id, user_id: params[:user_id], os: params[:os], description: params[:description])

  content_type :text
  "#{error.id}"
end

post '/error/check/:id' do
  error = PageError.find_by_id(params[:id])

  if error
    error.update(resolved?: true)

    content_type :text
    "Error ##{error.id} taken care of"
  else
    content_type :text
    "Couldn't find error ##{params[:id]}"
  end
end

post '/error/:id' do
  response['Access-Control-Allow-Origin'] = '*'
  error = PageError.find_by_id(params[:id]) if params[:id]

  content_type :text
  if error
    error.update(description: params[:description])
    "Added description to #{error.id}"
  else
    url_id = Url.rootify_find_create(params[:url]).id
    PageError.create(url_id: url_id, user_id: params[:user_id], os: params[:os], description: params[:description])
    "Could not find this error"
  end
end
