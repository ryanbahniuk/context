require_relative 'spec_helper'

describe Url do 
	let(:link) { "http://www.nytimes.com/test?test=123" }

	before(:all) do 
		@url = Url.create(link: "http://www.nytimes.com/test?test=123")
	end

	after(:all) do 
		@url.destroy
	end

	subject { @url }

	it { should respond_to(:link) }

	describe "::rootify" do 
		it "should return only host and path of link" do 
			root = Url.rootify(link)
			expect(root).to eq("www.nytimes.com/test")
		end
	end

	describe "::find_create" do 
		let(:new_url) { "www.theatlantic.com/test" }
		let(:old_url) { "www.nytimes.com/test" }

		it "should create a new url if not in database" do 
			expect{Url.find_or_create_by(link: new_url)}.to change{Url.count}.by(1)
		end
	end

end