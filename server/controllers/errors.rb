post '/error' do
  response['Access-Control-Allow-Origin'] = '*'

  url_id = Url.rootify_find_create(params[:url]).id

  PageError.create(url_id: url_id, user_id: params[:user_id], os: params[:os])
  
  content_type :text
  "Error submitted"

end