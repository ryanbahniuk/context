require 'faker'

module SeedUsers
	def self.run!
		5.times do |i|
			name = ::Faker::Name.name
			email = ::Faker::Internet.email(name)
			password = "password"
			user = User.create!(name: name, email: email, password: password)
			puts "seeding user #{i}" if user
		end
	end
end

module SeedUrls
	URLS = %w(http://devbootcamp.com http://www.cnn.com/2014/09/26/travel/chicago-ohare-midway-flights-stopped/index.html?hpt=hp_t1 http://www.huffingtonpost.com/2014/09/25/derek-jeter-walkoff-hit-final-home-game_n_5885606.html?testquery=blah http://www.ruby-doc.org/core-2.1.3/Array.html http://espn.go.com/)
	def self.run!
		URLS.each_with_index do |link, i|
			url = Url.create!(link: link)
			puts "seeding url #{i}" if url
		end
	end
end

module SeedMessages
	def self.run!
		50.times do |i|
			content = ::Faker::Hacker.say_something_smart
			user_id = rand(1..5)
			url_id = rand(1..5)
			message = Message.create!(content: content, user_id: user_id, url_id: url_id)
			puts "seeding message #{i}" if message
		end
	end
end

SeedUsers.run!
SeedUrls.run!
SeedMessages.run!
