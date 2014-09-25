require 'pg'

class PostgresDirect
	def connect
		@conn = PG.connect(
			dbname: 'test')
	end

	def createMessageTable
		@conn.exec("CREATE TABLE messages (id serial NOT NULL, text varchar(255));")	
		puts "created message table"
	end

	def addMessage(text)
		@conn.exec("INSERT INTO messages (text) VALUES ('#{text}')")
		puts "added #{text}"
	end

	def queryMessageTable
		@conn.exec("SELECT * FROM messages") do |result|
			result.each do |row|
				puts row
			end
		end
	end
end
