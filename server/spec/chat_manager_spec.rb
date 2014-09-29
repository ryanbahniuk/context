require 'rspec/mocks'
require_relative 'spec_helper'

describe ChatManager do
	before(:all) do
		@chat_manager = ChatManager.new
		@websocket = "existing websocket"
		@chat_manager.setup_client(@websocket, "www.theatlantic.com")
		User.create(name: "test user", email: "test@user.com", password: "password")
	end

	describe '#start' do
		it 'should start running websocket' do
			expect(EM::WebSocket).to receive(:start)
			@chat_manager.start(host: "0.0.0.0", port: 3001)
		end
	end

	describe '#setup_client' do
		it "should add a client to open_urls hash" do
			ws = "fake websocket"
			url = "www.nytimes.com"

			expect{@chat_manager.setup_client(ws, url)}.to change {@chat_manager.open_urls.keys}.by([url])
		end

		it "should add a client to existing url key's array" do
			ws = "fake websocket 2"
			url = "www.nytimes.com"

			expect{@chat_manager.setup_client(ws, url)}.not_to change {@chat_manager.open_urls.keys}
			expect(@chat_manager.open_urls.values.flatten).to include(ws)
		end
	end

	describe '#remove_client' do
		it "should remove existing client from open_urls hash" do
			expect{@chat_manager.remove_client("existing websocket")}.to change {@chat_manager.open_urls.values.flatten}
		end
	end

	describe '#route_message' do
		it "should call setup_client if an initial message is sent" do
			initial_msg = {"user_id" => 1, "url" => "http://www.theatlantic.com", "content" => "", "initial" => true}.to_json
			expect(@chat_manager).to receive(:setup_client).with(@websocket, "http://www.theatlantic.com")
			@chat_manager.route_message(@websocket, initial_msg)
		end

		it "should call handle_message if a user sends a message" do
			msg = {"user_id" => 1, "url" => "http://www.theatlantic.com", "content" => "test message"}.to_json
			expect(@chat_manager).to receive(:handle_message).with(@websocket, JSON.parse(msg))
			@chat_manager.route_message(@websocket, msg)
		end
	end

	describe "#message_recording_proc" do
		it "should create proc that adds a message to activerecord database" do
			msg = {"user_id" => 1, "url" => "http://www.nytimes.com/test", "content" => "test message"}
			mrp = @chat_manager.message_recording_proc(double("websocket"), msg)

			expect{ mrp.call }.to change {Message.count}.by(1)
		end
	end

	describe "#handle_message" do
		it "should call message_recording_proc and clear_database_connections_proc" do
			msg = {"user_id" => 1, "url" => "http://www.nytimes.com/test", "content" => "test message"}
			ws = double("websocket")
			expect(EM).to receive(:defer)
			expect(@chat_manager).to receive(:message_recording_proc).with(ws, msg)
			expect(@chat_manager).to receive(:clear_database_connections_proc)
			expect(@chat_manager).to receive(:send_all)
			@chat_manager.handle_message(ws, msg)
		end

		it "should call send_all" do
			msg = {"user_id" => 1, "url" => "http://www.nytimes.com/test", "content" => "test message"}
			ws = double("websocket")
			expect(EM).to receive(:defer)
			expect(@chat_manager).to receive(:send_all)
			@chat_manager.handle_message(ws, msg)
		end
	end

	describe "#send_all" do
		it "broadcasts to all clients" do
			clients = [double("client 1"), double("client 2")]
			msg = "test message"
			user = "test user"
			json_msg = {content: msg, author: user}.to_json
			expect(clients[0]).to receive(:send).with(json_msg)
			expect(clients[1]).to receive(:send).with(json_msg)

			@chat_manager.send_all(clients, msg, user)
		end
	end

end
