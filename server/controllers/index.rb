get '/?' do
	"Hello World"
end

get '/' do
  erb :index
end

get '/dev' do
  @errors = PageError.all
  erb :dev
end
