require_relative 'spec_helper'

describe ChatManager do 

	describe 'start' do 
		before(:all) do 
			@chat_manager = ChatManager.new
			EM.run { @chat_manager.start(host: "0.0.0.0", port: 3001) }
		end

		after(:all) do 
			EM.stop
		end

		it 'starts running' do 
			
			expect(@chat_manager.class).to eq(ChatManager)
		end


	end

	describe 'setup_client' do 
		xit "can add a client" do 

		end
	end
end