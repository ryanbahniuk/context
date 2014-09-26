require_relative 'database_connection'
require 'pg'

pg_db = PostgresDirect.new()
pg_db.connect
pg_db.drop_tables
