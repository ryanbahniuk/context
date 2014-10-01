post '/urls/messages/:i' do
	response['Access-Control-Allow-Origin'] = '*'

	formatted_url = Url.rootify(params[:url])
	url = Url.find_by(link: formatted_url)
	if !url.nil?
		messages = url.messages.last(params[:i]).map do |message|
			{
				author: message.user.name,
				content: message.content
			}
		end
		object = {messages: messages}.to_json
	else
		object = {}.to_json
	end
	content_type :json
	object
end
