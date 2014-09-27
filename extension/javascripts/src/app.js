/** @jsx React.DOM */

var loginUrl = "...";
var registerUrl = "...";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({

  getInitialState: function() {
    return {
      showAuth: true,
      showChat: false
    };
  },

  render: function() {
    return(
      <div className="App">
      {this.state.showAuth ? <UserAuth loginUrl={loginUrl} registerUrl={registerUrl} onSuccess={this.onUserSuccess}/> : null }
      {this.state.showChat ? <ChatBox socketAddress={socketAddress}/> : null}
      </div>
    );
  },

  onUserSuccess: function() {
    this.setState({showAuth: false, showChat: true});
  }

});

React.renderComponent(
  <App/>,
  document.getElementById("content")
);

// /urls/messages/10
// { url: ... }