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
    return (
      React.DOM.li({className: "message"}, 
      React.DOM.span({className: "messageAuthor"}, 
      this.props.author, ": "
      ), 
      React.DOM.p({className: "messageContent"}, 
      this.props.content
      )
      )
      );
  }
});

var ChatBox = React.createClass({displayName: 'ChatBox',
  loadMessages: function() {
    $.ajax({
      url: this.props.messageUrl,
      type: 'POST',
      data: {url: url},

      success: function(data) {
        var messages = this.state.data;
        messages = messages.push(data);
        this.setState({data: messages});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    // this.loadMessages();
    socket = new WebSocket(this.props.socketAddress);
    url = document.URL.split("?")[1].replace(/url=/,"");

    socket.onopen = function(event) {
      var socketStatus = document.getElementById('status');
      socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.URL;
      socketStatus.className = 'open';
      var msg = {url: url, initial: true};
      socket.send(JSON.stringify(msg));
    };
    socket.onmessage = function(e) {
      var message = e.data;
      console.log(e.data);
      this.add_message(message);
    }.bind(this);
  },

  getInitialState: function() {
    return {
      data: [],
      user: null
    };
  },

  handleMessageSubmit: function(m) {
    var messages = this.state.data;
    var user;
    chrome.storage.sync.get("user", function(obj){
      user = obj["user"];
    });
    this.setState({user: user});
    debugger;
    var user_id = user["id"];
    messages.push(m);
    this.setState({data: messages});
    var msg = {url: url, content: m.content, user_id: user_id};
    socket.send(JSON.stringify(msg));
  },

  add_message: function(message) {
    var messages = this.state.data;
    messages.push(message);
    this.setState({data: messages});
  },

  render: function() {
    return (
      React.DOM.div({className: "chatBox"}, 
        MessageList({data: this.state.data}), 
        ChatInput({onMessageSubmit: this.handleMessageSubmit})
        )
        );
    }
  });
