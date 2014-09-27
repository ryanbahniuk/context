/** @jsx React.DOM */

var socket;

$(document).ready(function() {
  console.log("load");
  var displayUrl = document.getElementById('url');
  var socketStatus = document.getElementById('status');
  // var socket = new WebSocket('ws://localhost:8080');
  socket = new WebSocket('ws://104.131.117.55:8080');
  var url = window.location.host + window.location.pathname;

  socket.onopen = function(event) {
    socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.UdRL;
    socketStatus.className = 'open';
    var msg = {url: url, initial: true};
    socket.send(JSON.stringify(msg));
  };

  socket.onmessage = function(e) {
    var message = event.data;
    chatBox.add(message);
  };

  displayUrl.innerHTML = url;
});

var ChatInput = React.createClass({displayName: 'ChatInput',
  handleSubmit: function(e) {
    e.preventDefault();
    // debugger;
    var c = this.refs.content.getDOMNode().value.trim();
    this.props.onMessageSubmit({content: c, author: "Current User"});
    this.refs.content.getDOMNode().value = '';
    return;
  },

  render: function() {
    return (
      React.DOM.form({className: "chatInput", onSubmit: this.handleSubmit}, 
      React.DOM.input({type: "text", ref: "content"}), 
      React.DOM.input({type: "submit"})
      )
      );
  }
});

var MessageList = React.createClass({displayName: 'MessageList',
  render: function() {
    // console.log("in messageList");
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
      React.DOM.h5({className: "messageAuthor"}, 
      this.props.author
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
      url: this.props.url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        var messages = this.state.data;
        messages = messages.concat(data);
        this.setState({data: messages});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    // this.socket = new WebSocket('ws://localhost:8080');
    // this.socket = new WebSocket('ws://104.131.117.55:8080');
    // this.loadMessages();
    // setInterval(this.loadMessages, this.props.pollInterval);
  },

  getInitialState: function() {
    return {data: []};
  },

  handleMessageSubmit: function(message) {
    var messages = this.state.data;
    messages.push(message);
    this.setState({data: messages});
    var msg = {url: url, message, message}
    socket.send();
  },

  add: function(message) {
    this.data.push(message);
  },

  render: function() {
    // console.log("in ChatBox render")
    return (
      React.DOM.div({className: "chatBox"}, 
      React.DOM.h3(null, "(0|\\|+3x+"), 
        MessageList({data: this.state.data}), 
        ChatInput({onMessageSubmit: this.handleMessageSubmit})
        )
        );
    }
  });


    React.renderComponent(
      ChatBox({url: "/messages", pollInterval: 3000}),
      document.getElementById("content")
      );