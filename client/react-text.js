/** @jsx React.DOM */

var socket = new WebSocket('ws://localhost:8080');
// var socket = new WebSocket('ws://104.131.117.55:8080');

socket.onmessage = function(e) {
  var message = event.data;
  chatBox.add(message);
}

var ChatInput = React.createClass({
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
      <form className="chatInput" onSubmit={this.handleSubmit}>
      <input type="text" ref="content"/>
      <input type="submit"/>
      </form>
      );
  }
});

var MessageList = React.createClass({
  render: function() {
    // console.log("in messageList");
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
    // $.ajax({
    //   url: this.props.url,
    //   dataType: 'json',
    //   type: 'GET',
    //   success: function(data) {
    //     var messages = this.state.data;
    //     messages = messages.concat(data);
    //     this.setState({data: messages});
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(this.props.url, status, err.toString());
    //   }.bind(this)
    // });
  },
  asdf

  componentDidMount: function() {
    // this.socket = new WebSocket('ws://localhost:8080');
    // this.socket = new WebSocket('ws://104.131.117.55:8080');
    this.loadMessages();
    // setInterval(this.loadMessages, this.props.pollInterval);
  },

  getInitialState: function() {
    return {data: []};
  },

  handleMessageSubmit: function(message) {
    var messages = this.state.data;
    messages.push(message);
    this.setState({data: messages});
  },

  add: function(message) {
    this.data.push(message);
  },

  render: function() {
    // console.log("in ChatBox render")
    return (
      <div className="chatBox">
        <h3>(0|\|+3x+</h3>
        < MessageList data={this.state.data} />
        < ChatInput onMessageSubmit={this.handleMessageSubmit} />
      </div>
      );
  }
});


React.renderComponent(
  <ChatBox url="/messages" pollInterval={3000}/>,
  document.getElementById("content")
  );