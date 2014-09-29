class CreatePageErrors < ActiveRecord::Migration
  def change
    create_table :page_errors do |t|
      t.belongs_to :user
      t.belongs_to :url
      t.text :description
      t.boolean :resolved?
      t.timestamps
    end
  end
end
