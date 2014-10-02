require_relative 'spec_helper'

describe Url do
	let(:link) { "http://www.nytimes.com/test?test=123" }

	before(:all) do
		@url = Url.create(link: "http://www.nytimes.com/test?test=123")
	end

	after(:all) do
		Url.destroy_all
	end

	subject { @url }

	it { should respond_to(:link) }

	describe "::rootify" do
		it "should return only host and path of link" do
			root = Url.rootify(link)
			expect(root).to eq("www.nytimes.com/test")
		end
	end

	describe "::rootify_find_create" do
		let(:new_url) { "http://www.theatlantic.com/test" }
		let(:old_url) { "http://www.nytimes.com/test" }

		it "should create a new url if not in database" do
			expect{Url.rootify_find_create(new_url)}.to change{Url.count}.by(1)
		end

		it "should not add a url if already in database" do
			expect{Url.rootify_find_create(new_url)}.to change{Url.count}.by(0)
		end
	end

end