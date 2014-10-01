get '/' do
  erb :index
end

get '/world' do
  content_type :json
  File.read(File.join('public', 'world.json'))
end

get '/world-2' do
  content_type :json
  File.read(File.join('public', 'world-2.json'))
end

get '/us' do
  content_type :json
  File.read(File.join('public', 'us.json'))
end

get '/albers_us' do
  content_type :json
  File.read(File.join('public', 'albers_us.json'))
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
