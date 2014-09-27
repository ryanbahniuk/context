post '/urls/get_messages/:i' do
	if request.xhr?
		url = Url.find_by(link: params[:url])
		if !url.nil?
			content_type :json
			url.messages.last(params[:i]).to_json
		else
			content_type :json
			{}.to_json
		end
	else
		"Request not allowed."
	end
end
