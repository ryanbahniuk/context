class User < ActiveRecord::Base
	has_many :messages
	validates :name, presence: true
	validates :email, format: { with: /\A.+@.+\..+\z/}, uniqueness: true
	has_secure_password
end
