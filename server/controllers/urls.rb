post '/urls/messages/:i' do
	response['Access-Control-Allow-Origin'] = '*'

	url = Url.find_by(link: params[:url])
	if !url.nil?
		object = {messages: url.messages.last(params[:i])}.to_json
	else
		object = {}.to_json
	end
	content_type :json
	object
end
