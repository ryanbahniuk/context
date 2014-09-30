class PageError < ActiveRecord::Base
  belongs_to :url
  belongs_to :user

  def self.all_with_description
    PageError.where("description <> ''")
  end

  def self.resolved
    PageError.where(resolved?: true)
  end

  def self.unresolved
    PageError.where(resolved?: false)
  end
end