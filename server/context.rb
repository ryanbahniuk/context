require_relative 'config/environment'

$SERVER_LOG = Logger.new('logs/server.log', 'monthly')

#Name for the pid file, this file will store the process id of the process we fork
PID_FILE = "context.pid"

if File.exists?(PID_FILE)
  puts "A pid file already exists. This might mean the server is still running."
  puts "Check to see if a process with the pid in #{PID_FILE} exists and kill it."
  puts "When you are sure there is no old server process running, delete #{PID_FILE} and re-run."
end

#Process.daemon forks off a new process and exits the parent process
#The code after "Process.daemon" runs in the detached child process
#The first argument says "don't change directory"
#The second argument says "put STDOUT input (e.g. puts statements) out to the screen"

#In practice you want STDOUT and STDERR to be redirected to a log file so you can
#see what your daemon process is doing. In that case, the second argument would be
# false (or just don't supply it), you'd redirect STDOUT/STDERR yourself to a file (or files)

Process.daemon(true, true)

#Get my pid. This will be the child process' pid because `Process.daemon` forked us off by now and killed the parent
pid = Process.pid.to_s

#Write it out to the filesystem
File.write(PID_FILE, pid)


#If we get kill signal (as in `kill 40141`, CTRL-C, `exit()`, etc) we need to do some cleanup.
#You can trap the kill signal and do stuff before you shutdown completely.
#In this case, we need to stop the event loop and delete the PID file to make a clean exit
Signal.trap('EXIT') do
  begin
    EM.stop
  rescue
  end
  File.delete(PID_FILE)
  puts "Stopped Server\n"
end


class ChatRoom
  def initialize
    @clients = []
  end

  def start(options)
    EM::WebSocket.start(options) do |ws|
      ws.onopen { add_client(ws) }
      ws.onmessage { |msg| handle_message(ws, msg) }
      ws.onclose { remove_client(ws) }
    end
  end

  def add_client(ws)
    @clients << ws
  end

  def remove_client(ws)
    client = @clients.delete(ws)
  end

  def handle_message(ws, msg)
    query = Proc.new {
      msg = ::JSON.parse(msg)
      link = Url.rootify(msg["url"])
      url = Url.find_or_create_by(link: link)
      message = Message.create(content: msg["message"], url: url)
    }

    EM.defer query
    send_all(msg["message"])
  end

  def send_all(msg)
    @clients.each do |ws|
      ws.send(msg)
    end
  end
end

chatroom = ChatRoom.new
EM.run {
  chatroom.start(host: "0.0.0.0", port: 8080)
}
