class PageError < ActiveRecord::Base
  belongs_to :url
  belongs_to :user

  def self.all_with_description
    PageError.where("description <> ''")
  end
end