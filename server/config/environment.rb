# Set up gems listed in the Gemfile.
# See: http://gembundler.com/bundler_setup.html
#      http://stackoverflow.com/questions/7243486/why-do-you-need-require-bundler-setup
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

require 'bundler/setup' if File.exists?(ENV['BUNDLE_GEMFILE'])

# Require gems we care about
require 'rubygems'

require 'em-websocket'
require 'pg'
require 'logger'
require 'pg/em'
require 'json'
require 'active_record'

# Some helper constants for path-centric logic
APP_ROOT = Pathname.new(File.expand_path('../../../', __FILE__))
APP_NAME = APP_ROOT.basename.to_s

# Set up the database and models
require APP_ROOT.join('server', 'config', 'database')
