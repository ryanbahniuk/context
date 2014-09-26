class Url < ActiveRecord::Base
	require 'uri'
	has_many :messages

	before_create :rootify

	def rootify
		uri = URI(self.link)
		self.link = uri.host + uri.path
	end

	def self.rootify(link)
		uri = URI(link)
		uri.host + uri.path
	end
end
