/** @jsx React.DOM */

var socket;
var url;

var ChatInput = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var c = this.refs.content.getDOMNode().value.trim();
    this.props.onMessageSubmit({content: c, author: "Current User"});
    this.refs.content.getDOMNode().value = '';
    return;
  },

  render: function() {
    return (
      <form className="chatInput" onSubmit={this.handleSubmit}>
      <input type="text" ref="content"/>
      <input type="submit"/>
      </form>
      );
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.data.map(function(message, index) {
      return (
        <Message author={message.author} content={message.content} key={index}/>
        );
    });
    return (
      <ul className="messageList">
      {messageNodes}
      </ul>
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

var Message = React.createClass({
  render: function() {
    return (
      <li className="message">
      <h5 className="messageAuthor">
      {this.props.author}
      </h5>
      <p className="messageContent">
      {this.props.content}
      </p>
      </li>
      );
  }
});

var ChatBox = React.createClass({
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
    // this.loadMessages();
    // setInterval(this.loadMessages, this.props.pollInterval);
    socket = new WebSocket(this.props.socket_address);
    url = window.location.host + window.location.pathname // document.URL.split("?")[1].replace(/url=/,"");
    socket.onopen = function(event) {
      var socketStatus = document.getElementById('status');
      socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.UdRL;
      socketStatus.className = 'open';
      var msg = {url: url, initial: true};
      socket.send(JSON.stringify(msg));
    };
    socket.onmessage = function(e) {
      var message = event.data;
      this.add_message(message);
    }.bind(this);
  },

  getInitialState: function() {
    return {data: []};
  },

  handleMessageSubmit: function(m) {
    var messages = this.state.data;
    messages.push(m);
    this.setState({data: messages});
    var msg = {url: url, message: m.content};
    socket.send(JSON.stringify(msg));
  },

  add_message: function(message) {
    this.state.data.push(message);
  },

  render: function() {
    return (
      <div className="chatBox">
      <div className="titleBar">(0|\|+3x+</div>
        < MessageList data={this.state.data} />
        < ChatInput onMessageSubmit={this.handleMessageSubmit} />
        </div>
        );
    }
  });


    React.renderComponent(
      <ChatBox socket_address='ws://104.131.117.55:8080'/>,
      document.getElementById("content")
      );