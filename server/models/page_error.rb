class PageError < ActiveRecord::Base
  belongs_to :url
  belongs_to :user
end