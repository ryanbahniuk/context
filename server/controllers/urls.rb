post '/urls/messages/:i' do
	response['Access-Control-Allow-Origin'] = '*'
	
	if request.xhr?
		url = Url.find_by(link: params[:url])
		if !url.nil?
			content_type :json
			return url.messages.last(params[:i]).to_json
		else
			content_type :json
			return {}.to_json
		end
	else
		return {error: "Request not allowed."}.to_json
	end
end
