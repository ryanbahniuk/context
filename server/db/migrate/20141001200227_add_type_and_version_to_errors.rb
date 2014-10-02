class AddTypeAndVersionToErrors < ActiveRecord::Migration
  def change
    add_column :page_errors, :type, :string
    add_column :page_errors, :version, :string
  end
end
