post '/error' do
  response['Access-Control-Allow-Origin'] = '*'

  url_id = Url.rootify_find_create(params[:url]).id
  error = PageError.create(url_id: url_id, user_id: params[:user_id], os: params[:os], type: params[:type], description: params[:description])

  content_type :text
  "#{error.id}"
end

post '/error/:id' do 
  response['Access-Control-Allow-Origin'] = '*'
  error = PageError.find(params[:id])
  error.update(description: params[:description])
  content_type :text
  "Added description to #{error.id}"
end