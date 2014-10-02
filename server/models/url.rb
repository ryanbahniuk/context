class Url < ActiveRecord::Base
	require 'uri'
	has_many :messages

  def self.rootify(url)
		uri = URI(url)
    puts uri.host + uri.path
    uri.host + uri.path
  end

  def self.find_create(link)
		self.find_or_create_by(link: link)
  end

  def self.rootify_find_create(link)
    uri = self.rootify(link)
    self.find_create(uri)
  end

end
