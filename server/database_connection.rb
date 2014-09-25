require 'pg'

class PostgresDirect
	def connect
		@conn = PG.connect(
			dbname: 'test')
	end

	def create_rooms_table
		@conn.exec("CREATE TABLE rooms (id serial NOT NULL UNIQUE)")
	end

	def create_messages_table
		@conn.exec("CREATE TABLE messages (id serial NOT NULL, content varchar(255), user_id int, room_id int, latitude float, longitude float, FOREIGN KEY(room_id) REFERENCES rooms(id));")	
		puts "created message table"
	end

	def create_users_table
		@conn.exec("CREATE TABLE users (id serial NOT NULL, name varchar(255), email varchar(255), password_digest varchar(255))")
	end

	def create_urls_table
		@conn.exec("CREATE TABLE urls (id serial NOT NULL UNIQUE, link varchar(1000))")
	end

	def create_join_table_urls_rooms
		@conn.exec("CREATE TABLE urls_rooms (id serial NOT NULL, url_id int, room_id int, FOREIGN KEY(room_id) REFERENCES rooms(id), FOREIGN KEY(url_id) REFERENCES urls(id))")
	end

	def create_schema_tables
		create_rooms_table
		create_messages_table
		create_users_table
		create_urls_table
		create_join_table_urls_rooms
	end

	def drop_tables
		@conn.exec("DROP TABLE IF EXISTS messages, users, rooms, urls, urls_rooms")
	end

	def add_message(args)
		content = args[:content] 
		user_id = args[:user_id] || "null"
		room_id = args[:room_id] || "null" 
		latitude = args[:latitude] || "null" 
		longitude = args[:longitude] || "null" 

		@conn.exec("INSERT INTO messages (content, user_id, room_id, latitude, longitude) VALUES ('#{content}', #{user_id}, #{room_id}, #{latitude}, #{longitude})")
	end


	def query_messages_table
		@conn.exec("SELECT * FROM messages") do |result|
			result.each do |row|
				puts row
			end
		end
	end
end
