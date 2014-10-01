class AddDefaultToErrors < ActiveRecord::Migration
  def change
    change_column :page_errors, :resolved?, :boolean, :default => false
  end
end
