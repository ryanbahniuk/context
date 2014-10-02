class ChatManager
  require 'json'
  attr_reader :open_urls
  attr_accessor :url_cookies

  def initialize
    @url_cookies = {}
    update_open_urls
    # {url => [ws1, ws2]}
    # url_cookies { url1 => {ws1: cookie1, ws2: cookie2}}
  end

  def url_cookies_to_s
    cookies_str = {}
    @url_cookies.each do |url, sockets|
      ws_representation = {}
      sockets.each do |ws, cookie|
        ws_representation.merge!({"ws #{ws.signature}" => cookie})
      end
      cookies_str.merge!({url => ws_representation})
    end
    cookies_str
  end

  def start(options)
    EM::WebSocket.start(options) do |ws|
      ws.onmessage { |msg| route_message(ws, msg) }
      ws.onclose { remove_client(ws) }
    end
  end

  def update_open_urls
    @open_urls = {}
    @url_cookies.each do |url, sockets|
      @open_urls[url] = sockets.keys
    end
    @open_urls
  end

  def route_message(ws, msg)
    message = JSON.parse(msg)

    if message["version"] != '0.0.8'
      send_version_error(ws)
    elsif message["initial"]
      setup_client(ws, message)
    else
      handle_message(ws, message)
    end
  end

  def send_version_error(ws)
    error = {content: "Your version of Context is super old.  Better upgrade to version 0.0.8", author: "Context", time: Time.now}.to_json;
    ws.send(error)
  end

  def setup_client(ws, message)
    url = message["url"]
    cookie = message["cookie"]

    add_ws_to_url_cookies({ws: ws, url: url, cookie: cookie})

    sockets = @url_cookies[url]
    send_all_user_number(sockets)
  end

  def add_ws_to_url_cookies(args)
    url = args[:url]
    ws = args[:ws]
    cookie = args[:cookie]

    if @url_cookies[url]
      @url_cookies[url].merge!({ws => cookie})
    else
      @url_cookies[url] = {ws => cookie}
    end

    update_open_urls
  end

  def send_all_user_number(sockets)
    clients = sockets.keys
    message = number_of_users(sockets)
    clients.each do |ws|
      ws.send(message)
      # $SERVER_LOG.info "sending #{message}"
    end
  end

  def number_of_users(sockets)
    cookies = sockets.values.uniq
    {num: cookies.length}.to_json
  end

  def remove_client(ws)
    @url_cookies.each do |url, sockets_hash|
      if sockets_hash.has_key?(ws)
        sockets_hash.delete(ws)
        update_open_urls
        send_all_user_number(sockets_hash)
      end
    end

  end

  def message_recording_proc(ws, msg)
    Proc.new {
      user_id = msg["user_id"]
      content = msg["content"]
      lat = msg["coords"][0].to_f
      lon = msg["coords"][1].to_f
      url = Url.rootify_find_create(msg["url"])
      start_time = Time.now
      # $SERVER_LOG.info("Saving message -- #{msg["content"]}")
      message = Message.create(content: content, url: url, user_id: user_id, latitude: lat, longitude: lon)
      # $SERVER_LOG.info ("Message saved (#{msg["content"]}) -- #{Time.now - start_time}")
    }
  end

  def clear_database_connections_proc
    Proc.new {
      ActiveRecord::Base.clear_reloadable_connections!
    }
  end

  def handle_message(ws, msg)
    if msg["cookie"]
      begin
        decoded = Base64.decode64(msg["cookie"].encode('ascii-8bit'))
        decrypted = Encryptor.decrypt(decoded, key: SECRET_KEY)
        user_id = decrypted
        user = User.find_by_id(user_id)
        msg["user_id"] = user_id
      rescue Exception => e
        $SERVER_LOG.error "handle message error = #{e.message}"
        $SERVER_LOG.error "handle message error = #{e.backtrace.inspect}"
        user = nil
      end
    else
      user = nil
    end

    if user
      EM.defer message_recording_proc(ws, msg), clear_database_connections_proc
      ws_array = @open_urls[msg["url"]]
      send_all(ws_array, msg["content"], user.name)
    else
      return_error(ws)
    end
  end

  def send_all(clients, content, name)
    message = {content: content, author: name, time: Time.now}.to_json
    clients.each do |ws|
      ws.send(message)
      # $SERVER_LOG.info "sending #{message}"
    end
  end

  def return_error(ws)
    message = {content: "You are not logged in properly. Please logout and try again.", author: "CONTEXT", time: Time.now}.to_json
    ws.send(message)
  end

  def url_log
    string_urls = {}
    @open_urls.each { |url, clients| string_urls[url] = clients.length }
  end

end
