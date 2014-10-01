class ChatManager
  require 'json'
  attr_reader :open_urls

  def initialize
    @open_urls = {}
  end

  def start(options)
    EM::WebSocket.start(options) do |ws|
      ws.onmessage { |msg| route_message(ws, msg) }
      ws.onclose { remove_client(ws) }
    end
  end

  def remove_client(ws)
    @open_urls.each do |url, arr|
      if arr.include?(ws)
        # $SERVER_LOG.info("Deleting #{ws}")
        arr.delete(ws)
        # $SERVER_LOG.error("Delete failed--#{ws}") if arr.include?(ws)
      end
    end
  end

  def route_message(ws, msg)
    msg = JSON.parse(msg)

    if msg["initial"]
      setup_client(ws, msg["url"])
    else
      handle_message(ws, msg)
    end
  end

  def setup_client(ws, url)
    if @open_urls[url]
      @open_urls[url] << ws
    else
      @open_urls[url] = [ws]
    end
    ws.send({num: @open_urls[url].length}.to_json)
    # $SERVER_LOG.info url_log
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
      decoded = Base64.decode64(msg["cookie"].encode('ascii-8bit'))
      decrypted = Encryptor.decrypt(decoded, key: SECRET_KEY)
      user_id = decrypted
      user = User.find_by_id(user_id)
      msg["user_id"] = user_id
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
    message = {content: content, author: name, time: TimeDisplay.time_or_date(Time.now, 0)}.to_json
    clients.each do |ws|
      ws.send(message)
      # $SERVER_LOG.info "sending #{message}"
    end
  end

  def return_error(ws)
    message = {content: "You are not logged in properly. Please logout and try again.", author: "CONTEXT"}.to_json
    ws.send(message)
  end

  def url_log
    string_urls = {}
    @open_urls.each { |url, clients| string_urls[url] = clients.length }
  end

end

module TimeDisplay
  def self.time_or_date(time, timezone_offset)
    timezone_time = time - timezone_offset * 60
    if same_day(time)
      timezone_time.strftime "%I:%M %P"
    else
      timezone_time.strftime "%m/%d"
    end
  end

  def self.time_passed(time)
    short_time_units_relative = {
      min: 1,
      hour: 60,
      day: 24,
      week: 7
    }
  end

  def self.same_day(time)
    now = Time.now
    today = Time.new(now.year, now.month, now.day)
    date_given = Time.new(time.year, time.month, time.day)
    today == date_given
  end
end
