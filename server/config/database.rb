Dir[APP_ROOT.join('server', 'models', '*.rb')].each do |model_file|
	filename = File.basename(model_file).gsub('.rb', '')
	autoload ActiveSupport::Inflector.camelize(filename), model_file
end

# We have to do this in case we have models that inherit from each other.
# If model Student inherits from model Person and app/models/student.rb is
# required first, it will throw an error saying "Person" is undefined.
#
# With this lazy-loading technique, Ruby will try to load app/models/person.rb
# the first time it sees "Person" and will only throw an exception if
# that file doesn't define the Person class.

# db = URI.parse("postgres://root:root@localhost/context")
db = URI.parse(ENV['DATABASE_URL'] || "postgres://localhost/#{APP_NAME}")

DB_NAME = db.path[1..-1]

ActiveRecord::Base.establish_connection(
	:adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
	:host     => db.host,
	:port     => db.port,
	:username => db.user,
	:password => db.password,
	:database => DB_NAME,
	:encoding => 'utf8'
)
