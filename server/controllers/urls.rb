post '/urls/get_messages/:i' do
	url = Url.find_by(link: params[:url])
	if !url.nil?
		content_type :json
		url.messages.last(params[:i]).to_json
	else
		content_type :json
		{}.to_json
	end
end
