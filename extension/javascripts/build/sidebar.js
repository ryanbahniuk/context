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
      React.DOM.ul({className: "messageList"}, 
      messageNodes
      )
      );
  },

  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.shouldScroll = node.scrollTop + node.offsetHeight - 2 === node.scrollHeight;

    // console.log("-----------------------------------------------")
    // console.log("scrollTop = " + node.scrollTop);
    // console.log("offsetHeight = " + node.offsetHeight);
    // console.log("scrollHeight = " + node.scrollHeight);
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
  render: function() {
    var messageContent = Autolinker.link(this.props.content, {newWindow: true})
    // console.log(Autolinker.link(this.props.content, {newWindow: true}))
    return (
      React.DOM.li({className: "message"}, 
      React.DOM.span({className: "messageAuthor"}, 
      this.props.author, ": "
      ), 
      React.DOM.p({className: "messageContent", dangerouslySetInnerHTML: {__html: messageContent}}
      )
      )
      );
  }
});

var DisplayConnection = React.createClass({displayName: 'DisplayConnection',
  render: function() {
    return (
      React.DOM.p(null, " ", this.props.status, " ")
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
      for(var i = 0; i < response["messages"].length; i++) {
        message = response["messages"][i];
        messages.push(message);
      }
      this.setState({data: messages})
    }.bind(this));
  },

  componentDidMount: function() {
    socket = new WebSocket(this.props.socketAddress);
    url = document.URL.split("?")[1].replace(/url=/,"");
    this.getCoords();
    this.loadMessages(url);
    socket.onopen = function(event) {
      this.setState({connectionStatus: 'Connected to: ' + event.currentTarget.URL});
      var msg = {url: url, initial: true};
      socket.send(JSON.stringify(msg));
    }.bind(this);
    socket.onmessage = function(e) {
      var message = JSON.parse(e.data);
      this.add_message(message);
    }.bind(this);
  },

  getInitialState: function() {
    return { data: [], connectionStatus: "Disconnected", coords: [] };
  },

  getCoords: function() {
    chrome.storage.sync.get("coords", function(obj){
      this.setState({coords: [obj["coords"][0], obj["coords"][1]] });
    }.bind(this));
  },

  handleMessageSubmit: function(m) {
    var messages = this.state.data;
    var coords = this.state.coords;
    console.log(typeof coords[0]);
    console.log(coords[1]);
    var user_id = user["id"];
    var msg = {url: url, content: m.content, user_id: user_id, coords: coords };
    socket.send(JSON.stringify(msg));
  },

  add_message: function(message) {
    if (this.state.coords == false) {
      this.getCoords();
    };
    var messages = this.state.data;
    messages.push(message);
    this.setState({data: messages});
  },

  render: function() {
    return (
      React.DOM.div({className: "chatBox"}, 
        MessageList({data: this.state.data}), 
        DisplayConnection({status: this.state.connectionStatus}), 
        ChatInput({onMessageSubmit: this.handleMessageSubmit})
        )
        );
    }
  });
