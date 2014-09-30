get '/?' do
	"Hello World"
end

get '/dev' do
  @errors = PageError.all
  erb :dev
end
