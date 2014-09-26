class Url < ActiveRecord::Base
	require 'uri'
	has_many :messages

	def self.rootify_find_create(link)
		uri = URI(link)
		link = uri.host + uri.path
		self.find_or_create_by(link: link)
	end
end
