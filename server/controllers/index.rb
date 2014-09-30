get '/?' do
	"Hello World"
end

get '/dev' do
  redirect '/dev/errors'
end

get '/dev/errors' do
  @errors = PageError.where(resolved?: false)
  erb :dev
end

get '/dev/errors/complete' do
  @errors = PageError.where(resolved?: true)
  erb :dev
end

get '/dev/errors/all' do
  @errors = PageError.all
  erb :dev
end
