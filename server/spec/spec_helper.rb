require_relative '../config/environment'
dbconfig = YAML.load(File.read('config/database.yml'))
ActiveRecord::Base.establish_connection dbconfig['test']

require 'em-websocket'
require 'eventmachine'
