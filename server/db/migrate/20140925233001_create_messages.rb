class CreateMessages < ActiveRecord::Migration
	def change
		create_table :messages do |t|
			t.text :content
			t.integer :user_id
			t.integer :url_id
			t.float :latitude
			t.float :longitude

			t.timestamps
		end
	end
end
@conn.exec("CREATE TABLE messages (id serial NOT NULL UNIQUE, content varchar(255), user_id int, url_id int, latitude float, longitude float, FOREIGN KEY(url_id) REFERENCES urls(id));")
