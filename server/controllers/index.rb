get '/?' do
  erb :index
end

get '/about/?' do
  erb :about
end

get '/dev' do
  redirect '/dev/errors'
end

get '/dev/errors' do
  @errors = PageError.where(resolved?: false)
  erb :error_table, :layout => :dev_layout
end

get '/dev/errors/complete' do
  @errors = PageError.where(resolved?: true)
  erb :error_table, :layout => :dev_layout
end

get '/dev/errors/all' do
  @errors = PageError.all
  erb :error_table, :layout => :dev_layout
end

get '/dev/stats' do
  @user_count = User.count
  erb :stats, :layout => :dev_layout
end
