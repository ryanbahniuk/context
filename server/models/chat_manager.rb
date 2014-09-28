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
        $SERVER_LOG.info("Deleting #{ws}")
        arr.delete(ws)
        $SERVER_LOG.error("Delete failed--#{ws}") if arr.include?(ws)
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
    # $SERVER_LOG.info url_log
    p "OPEN URLS:---------------------------"
    p @open_urls
  end

  def handle_message(ws, msg)
    p "MESSAGE: #{msg}"
    query = Proc.new {
      start_time = Time.now
      $SERVER_LOG.info("Saving message -- #{msg["message"]}")
      url = Url.find_create(msg["url"])
      message = Message.create(content: msg["message"], url: url)
      $SERVER_LOG.info ("Message saved (#{msg["message"]}) -- #{Time.now - start_time}")
    }
    callback = Proc.new {
      ActiveRecord::Base.clear_reloadable_connections!
    }
    EM.defer query, callback
    send_all(msg["url"], msg["message"])
  end

  def send_all(url, msg)
    @open_urls[url].each do |ws|
      ws.send(msg)
      $SERVER_LOG.info "sending #{msg}"
    end
  end

  def url_log
    string_urls = {}
    @open_urls.each { |url, clients| string_urls[url] = clients.length } 
  end

end
