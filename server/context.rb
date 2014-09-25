require 'em-websocket'
require 'pg'
require 'logger'
$SERVER_LOG = Logger.new('logs/server.log', 'monthly')

require_relative 'database_connection'

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

# exec("createdb context") # need to run create db first time on server
pg_db = PostgresDirect.new()
pg_db.connect
# pg_db.drop_tables
# pg_db.create_schema_tables

EM.run {
  EM::WebSocket.run(:host => "0.0.0.0", :port => 8080) do |ws|
    ws.onopen { |handshake|
      $SERVER_LOG.debug("Websocket connection opened.")

      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      # Publish message to the client
      ws.send "Welcome!"
    }

    ws.onclose { $SERVER_LOG.debug("Websocket connection closed.") }

    ws.onmessage { |msg|
      $SERVER_LOG.debug("Received message: #{msg}")
      ws.send "Pong: #{msg}"
      pg_db.add_message(content: msg)
      pg_db.query_messages_table
    }
  end
}
