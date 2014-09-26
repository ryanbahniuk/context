require_relative 'database_connection'
require 'pg'

exec("createdb context") # need to run create db first time on server
