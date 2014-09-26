class ChatManager
  require 'json'

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
    @open_urls.each { |url, arr|
      p arr.length
      if arr.include?(ws)
        arr.delete(ws)
        p "client removed"
        p arr.length
      end
    }
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
    p "OPEN URLS:---------------------------"
    p @open_urls
  end

  def handle_message(ws, msg)
    p "MESSAGE: #{msg}"
    query = Proc.new {
      url = Url.find_create(msg["url"])
      message = Message.create(content: msg["message"], url: url)
    }
    EM.defer query
    send_all(msg["url"], msg["message"])
  end

  def send_all(url, msg)
    @open_urls[url].each do |ws|
      ws.send(msg)
    end
  end

end
