require_relative 'database_connection'
require 'pg'

pg_db = PostgresDirect.new()
pg_db.connect
pg_db.create_schema_tables
