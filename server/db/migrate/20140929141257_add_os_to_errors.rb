class AddOsToErrors < ActiveRecord::Migration
  def change
    add_column :page_errors, :os, :string
  end
end
