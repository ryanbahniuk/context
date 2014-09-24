require 'em-websocket'

class Websocket

  def initialize(host_info={})
    @host_info = {:host => "0.0.0.0", :port => 8080}
    .merge(host_info)
  end

  def start!
    last_msg = nil
    EM.run do
      EM::WebSocket.run(@host_info) do |ws|
        ws.onopen do
          @clients << ws
          ws.send(last_msg)
        end

        ws.onclose do
          @clients.delete(ws)
        end
      end
    end
  end

end
