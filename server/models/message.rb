class Message < ActiveRecord::Base
	belongs_to :user
	belongs_to :url
end
