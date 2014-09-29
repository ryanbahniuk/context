/** @jsx React.DOM */

var socket;
var url;

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
      <span className="messageAuthor">
      {this.props.author}:&nbsp;
      </span>
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
      url: this.props.messageUrl,
      type: 'POST',
      data: {url: url},

      success: function(data) {
        var messages = this.state.data;

        if(data !== {}) {
          messages = messages.push(data);
          this.setState({data: messages});
        }
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
      // var socketStatus = document.getElementById('status');
      // socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.URL;
      // socketStatus.className = 'open';
      var msg = {url: url, initial: true};
      socket.send(JSON.stringify(msg));
    };
    socket.onmessage = function(e) {
      var message = JSON.parse(e.data);
      this.add_message(message);
    }.bind(this);
  },

  getInitialState: function() {
    return { data: [] };
  },

  handleMessageSubmit: function(m) {
    var messages = this.state.data;
    var user_id = user["id"];
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
      <div className="chatBox">
        < MessageList data={this.state.data} />
        < ChatInput onMessageSubmit={this.handleMessageSubmit} />
        </div>
        );
    }
  });
