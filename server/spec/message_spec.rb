require_relative 'spec_helper'

describe Message do 
	let(:url) {Url.create(link: "www.nytimes.com")}
	let(:user) {User.create(name: "test user", email: "test@user.com", password: "password", password_confirmation: "password")}
	before do
		@message = Message.new(content: "test message", user_id: 1, url_id: 1)
	end

	subject { @message }

	it { should respond_to(:content) }
	it { should respond_to(:user) }
	it { should respond_to(:url) }
end