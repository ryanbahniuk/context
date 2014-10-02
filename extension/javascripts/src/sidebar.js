/** @jsx React.DOM */

var socket;
// var url;

var ChatInput = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var c = this.refs.content.getDOMNode().value.trim();
    this.props.onMessageSubmit({content: c});
    this.refs.content.getDOMNode().value = '';
    return;
  },

  render: function() {
    return (
      <form className="chatInput" onSubmit={this.handleSubmit}>
        <input type="text" ref="content"/>
        <input type="submit" value="Send"/>
      </form>
      );
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.data.map(function(message, index) {
      return (
        <Message author={message.author} content={message.content}  time={message.time} key={index} />
        );
    });
    return (
      <ul className="messageList" onScroll={this.logScrollPosition} >
      {messageNodes}
      </ul>
      );
  },

  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.shouldScroll = Math.abs(node.scrollTop + node.offsetHeight - node.scrollHeight) < 20;
  },

  componentDidUpdate: function() {
    if (this.shouldScroll === true) {
      var node = this.getDOMNode();
      node.scrollTop = node.scrollHeight;
    };
  }
});

var Message = React.createClass({
  emojifyText: function(message) {
    return emojify.replace(message);
  },

  render: function() {
    var messageContent = Autolinker.link(this.props.content, {newWindow: true});
    var imagedMessage = messageContent.replace(/<a href="(.+).(gif|jpg|jpeg|png)(.+)<\/a>/, function(hrefTag) {
      var link = hrefTag.match(/>(.+)</)[0]
      var link = link.substring(1, link.length - 1)
      return "<img src=\"http://" + link + "\" class='user-inserted-image'>";
    });
    var imagedMessage = this.emojifyText(imagedMessage);
    return (
      <li className="message">
      <TimeStamp time={this.props.time} />
      <span className="messageAuthor">
      {this.props.author}:&nbsp;
      </span>
      <span className="messageText" dangerouslySetInnerHTML={{__html: imagedMessage}}></span>
      </li>
      );
  }
});

var TimeStamp = React.createClass({
  formatAMPM: function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  },

  formatDate: function(date) {
    var month = date.getMonth();
    var day = date.getDate();
    strDate = month + 1 + '/' + day;
    return strDate;
  },

  chooseDateTime: function(date) {
    var now = new Date();
    var then = new Date(date);
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var thenDate = new Date(then.getFullYear(), then.getMonth(), then.getDate());
    if(today - thenDate === 0) {
      return this.formatAMPM(then);
    } else {
      return this.formatDate(then);
    }
  },

  render: function() {
    var sentTime = new Date(this.props.time);
    var displayTimeStamp = this.chooseDateTime(sentTime);
    return (
      <span className = "messageTimeStamp">
        {displayTimeStamp}
      </span>
    );
  }
});

var ChatConnection = React.createClass({
  render: function() {
    return (
      <div className="chatConnection connection">
        <i className="fa fa-frown-o fa-5x"></i>
        <p>Something went wrong</p>
        <button onClick={this.props.onReload}>Reload</button>
      </div>
    );
  }
});

var ChatWaiting = React.createClass({
  render: function() {
    return(
      <div className="chatWaiting">
        <i className="fa fa-circle-o-notch fa-spin fa-4x"></i>
      </div>
    );
  }
});

var ChatBox = React.createClass({
  loadMessages: function(url) {
    var data = "url=" + encodeURIComponent(url);
    var request = $.ajax(messageUrl, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      data: data,
    });
    request.done(function(response){
      var messages = this.state.data;
      if (response["messages"] !== undefined) {
        for(var i = 0; i < response["messages"].length; i++) {
          message = response["messages"][i];
          messages.push(message);
        }
        this.setState({data: messages});
      }
    }.bind(this));
  },

  componentDidMount: function() {
    url = document.URL.split("?")[1].replace(/url=/,"");
    this.openSocket();
    this.getCoords();
    this.loadMessages(url);
  },

  componentWillMount: function() {
    this.setState({waiting: false});
  },

  openSocket: function() {
    socket = new WebSocket(socketAddress);

    socket.onopen = function(event) {
      console.log("socket open");
      this.setState({connection: true, waiting: false});
      var msg = {url: url, initial: true, cookie: user["cookie"], version: version};
      console.log(msg)
      socket.send(JSON.stringify(msg));
    }.bind(this);

    socket.onmessage = function(e) {
      this.isMounted() ? this.setState({connection: true, waiting: false}) : null;
      var message = JSON.parse(e.data);
      if (message["content"] !== undefined) {
        this.add_message(message);
      }
      else if (message["error"] !== undefined) {
        this.setState({error: message["error"]});
      }
      else{
        this.setState({userCount: message["count"]});
      }
    }.bind(this);

    socket.onerror = function() {
      // console.log("socket error");
      this.setConnectionError();
    }.bind(this);

    socket.onclose = function() {
      // console.log("socket closed");
      this.setConnectionError();
    }.bind(this);
  },

  showUsers: function(message){
    if (message["num"] === 1) {
      var msg = "You're alone here. Invite your friends!";
    } else {
      var msg = message["num"] + " people connected";
    }
    return (
      msg
      );
  },

  getInitialState: function() {
    return { data: [], connection: true, coords: [], waiting: true, errors: [] };
  },

  getCoords: function() {
    // chrome.storage.sync.get("coords", function(obj){
    //   this.setState({coords: [obj["coords"][0], obj["coords"][1]] });
    // }.bind(this));
    if(this.isMounted()){
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        // console.log("coords: " + lat + " , " + lon)
        this.setState({coords: [lat, lon]});
        // console.log("state: " + this.state.coords)
      }.bind(this));
    }
  },

  changeScriptTags: function(m) {
    var contentAllScript = m.content.indexOf("<script>") == 0 && m.content.indexOf("</script>") == m.content.length - 9
    if (contentAllScript) {
      m.content = "http://www.tehcute.com/pics/201204/bunny-falls-asleep-at-desk.jpg";
    }
    return m;
  },

  setConnectionError: function() {
    setTimeout(function() {
      this.setState({connection: false});
    }.bind(this), 1500);
  },

  handleMessageSubmit: function(m) {
    m = this.changeScriptTags(m);
    var coords = this.state.coords;
    if (m.content !== "") {
      var messages = this.state.data;
      var msg = {url: url, content: m.content, cookie: user["cookie"], coords: coords, version: version };
      console.log(msg);
      socket.send(JSON.stringify(msg));
    }
  },

  add_message: function(message) {
    if (this.state.coords == false) {
      this.getCoords();
    };
    message["content"] = message["content"].replace(/</, "\u003c").replace(/>/, "\u003e");
    var messages = this.state.data;
    messages.push(message);
    // console.log("chatBox isMounted(): " + this.isMounted());
    this.isMounted() ? this.setState({data: messages}) : null;
  },

  handleReload: function() {
    this.openSocket();
  },

  render: function() {
    if (this.state.waiting){
      return (
        <div className="chatBox"><ChatWaiting/></div>)
    }
    else if(this.state.connection){
      return (
        <div className="chatBox">
          < UserCount count={this.state.userCount} />
          < MessageList data={this.state.data} />
          < ChatInput onMessageSubmit={this.handleMessageSubmit} />
        </div>
      );
    } else{
      return (
        <div className="chatBox">
          < ChatConnection connection={this.state.connected} onReload={this.handleReload} />
        </div>
      );
    }
  }
});

var UserCount = React.createClass ({
  render: function(){
    var count = this.props.count;
    var rand = Math.random() * 2;
    if(count > 1) {
      return (
        <div className="userCount">
        {count + " users present"}
        </div>
        );     
    } else if(rand >= 1) {
      return(
        <div className="userCount">
        {"You're alone here. "} <a target="_blank" href="https://chrome.google.com/webstore/detail/context/bdedbolefbekcmfkjnffkoabnclfbcmh?hl=en-US&utm_source=chrome-ntp-launcher">Invite your friends!</a>
        </div>
        );
    } else {
      <div className="userCount">
        {"It'll catch on eventually "} <a target="_blank" href="https://chrome.google.com/webstore/detail/context/bdedbolefbekcmfkjnffkoabnclfbcmh?hl=en-US&utm_source=chrome-ntp-launcher">Invite your friends!</a>
      </div>
    }
  }

});
