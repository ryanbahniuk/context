/** @jsx React.DOM */

var socket;
var url;

var ChatInput = React.createClass({displayName: 'ChatInput',
  handleSubmit: function(e) {
    e.preventDefault();
    var c = this.refs.content.getDOMNode().value.trim();
    this.props.onMessageSubmit({content: c});
    this.refs.content.getDOMNode().value = '';
    return;
  },

  render: function() {
    return (
      React.DOM.form({className: "chatInput", onSubmit: this.handleSubmit}, 
      React.DOM.input({type: "text", ref: "content"}), 
      React.DOM.input({type: "submit", value: "Send"})
      )
      );
  }
});

var MessageList = React.createClass({displayName: 'MessageList',
  render: function() {
    var messageNodes = this.props.data.map(function(message, index) {
      return (
        Message({author: message.author, content: message.content, key: index})
        );
    });
    return (
      React.DOM.ul({className: "messageList", onScroll: this.logScrollPosition }, 
      messageNodes
      )
      );
  },

  logScrollPosition: function() {
    var node = this.getDOMNode();
    var shouldScroll = Math.abs(node.scrollTop + node.offsetHeight - node.scrollHeight) < 20;
    // console.log("-----------------------------------------------")
    // console.log("scrollTop = " + node.scrollTop);
    // console.log("offsetHeight = " + node.offsetHeight);
    // console.log("scrollHeight = " + node.scrollHeight);
    // console.log("shouldScroll = " + shouldScroll);
  },
  
  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.shouldScroll = Math.abs(node.scrollTop + node.offsetHeight - node.scrollHeight) < 20;
    // console.log("-----------------------------------------------")
    // console.log("shouldScroll = " + this.shouldScroll);
  },

  componentDidUpdate: function() {
    if (this.shouldScroll === true) {
      var node = this.getDOMNode();
      node.scrollTop = node.scrollHeight;
    };
  }
});

var Message = React.createClass({displayName: 'Message',
  emojifyText: function(message) {
    return emojify.replace(message);
  },

  render: function() {
    var messageContent = Autolinker.link(this.props.content, {newWindow: true});
    var imagedMessage = messageContent.replace(/<a href="(.+).(gif|jpg|jpeg|png)(.+)<\/a>/, function(hrefTag) {
      var link = hrefTag.match(/>(.+)</)[0]
      var link = link.substring(1, link.length - 1)
      console.log("<img src=\"" + link + "\">");
      return "<img src=\"http://" + link + "\" class='user-inserted-image'>";
    });
    var imagedMessage = this.emojifyText(imagedMessage);
    return (
      React.DOM.li({className: "message"}, 
      React.DOM.span({className: "messageAuthor"}, 
      this.props.author, ": "
      ), 
      React.DOM.p({className: "messageContent", dangerouslySetInnerHTML: {__html: imagedMessage}}
      )
      )
      );
  }
});

var ChatConnection = React.createClass({displayName: 'ChatConnection',
  render: function() {
    return (
      React.DOM.div({className: "chatConnection connection"}, 
        React.DOM.i({className: "fa fa-frown-o fa-5x"}), 
        React.DOM.p(null, "Something went wrong"), 
        React.DOM.button({onClick: this.props.onReload}, "Reload")
      )
    );
  }
});

var ChatWaiting = React.createClass({displayName: 'ChatWaiting',
  render: function() {
    return(
      React.DOM.div({className: "chatWaiting"}, 
        React.DOM.i({className: "fa fa-circle-o-notch fa-spin fa-4x"})
      )
    );
  }
});

var ChatBox = React.createClass({displayName: 'ChatBox',
  loadMessages: function(url) {
    var data = "url=" + encodeURIComponent(url);
    var request = $.ajax(messageUrl, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      data: data
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
    this.openSocket();
    url = document.URL.split("?")[1].replace(/url=/,"");
    this.getCoords();
    this.loadMessages(url);
  },

  openSocket: function() {
    socket = new WebSocket(this.props.socketAddress);

    socket.onopen = function(event) {
      this.setState({connection: true, waiting: false});
      var msg = {url: url, initial: true};
      socket.send(JSON.stringify(msg));
    }.bind(this);

    socket.onmessage = function(e) {
      this.setState({connection: true, waiting: false});
      var message = JSON.parse(e.data);
      this.add_message(message);
    }.bind(this);

    socket.onerror = function() {
      this.setConnectionError();
    }.bind(this);

    socket.onclose = function() {
      this.setConnectionError();
    }.bind(this);
  },

  getInitialState: function() {
    return { data: [], connection: true, coords: [], waiting: true };
  },

  getCoords: function() {
    chrome.storage.sync.get("coords", function(obj){
      this.setState({coords: [obj["coords"][0], obj["coords"][1]] });
    }.bind(this));
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
    var user_id = user["id"];
    if (m.content !== "") {
      var messages = this.state.data;
      var msg = {url: url, content: m.content, user_id: user_id, coords: coords };
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
    this.setState({data: messages});
  },

  handleReload: function() {
    this.openSocket();
  },

  render: function() {
    if (this.state.waiting){
      return ( 
        React.DOM.div({className: "chatBox"}, ChatWaiting(null)))
    }
    else if(this.state.connection){
      return (
        React.DOM.div({className: "chatBox"}, 
          MessageList({data: this.state.data}), 
          ChatInput({onMessageSubmit: this.handleMessageSubmit})
        )
      );
    } else{
      return (
        React.DOM.div({className: "chatBox"}, 
          ChatConnection({connection: this.state.connected, onReload: this.handleReload})
        )
      );
    }
  }
});
