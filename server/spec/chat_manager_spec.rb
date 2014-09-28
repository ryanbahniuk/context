require 'rspec/mocks'
require_relative 'spec_helper'

describe ChatManager do 

	describe 'start' do 
		before(:all) do 
			@chat_manager = ChatManager.new
		end

		after(:all) do 
			# @chat_manager.
		end

		it 'should start running websocket' do 
			EM.run do 
				manager = spy('chat_manager')
				# spy on chat manager 
				@chat_manager.start(host: "0.0.0.0", port: 3001)
				# expect websocket to be called
				# allow(EM::WebSocket).to receive(:start).and_return(true)
				expect(EM::WebSocket).to receive(:start)
				EM.stop
			end
		end
	end

	describe 'setup_client' do 
		before(:all) do 
			@chat_manager = ChatManager.new
		end

		it "should add a client to open_urls hash" do 
			EM.run do 
				@chat_manager.start(host: "0.0.0.0", port: 3001)
				ws = "fake websocket"
				url = "www.nytimes.com"
				
				expect{@chat_manager.setup_client(ws, url)}.to change {@chat_manager.open_urls}
				EM.stop
			end
		end
	end
end