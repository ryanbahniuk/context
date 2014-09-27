# Require config/environment.rb
require ::File.expand_path('../config/environment',  __FILE__)

set :app_file, __FILE__
set :server, %w[unicorn thin webrick]

run Sinatra::Application