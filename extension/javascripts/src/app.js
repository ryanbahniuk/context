/** @jsx React.DOM */

var loginUrl = "http://104.131.117.55:3000/login";
var registerUrl = "http://104.131.117.55:3000/users";
var messageUrl = "http://104.131.117.55:3000/urls/messages/10";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({

  getInitialState: function() {
    return {
      showAuth: true,
      showChat: false,
      user: null
    };
  },

  render: function() {
    return(
      <div className="App">
      {this.state.showAuth ? <UserAuth loginUrl={loginUrl} registerUrl={registerUrl} onSuccess={this.onUserSuccess}/> : null }
      {this.state.showChat ? <ChatBox socketAddress={socketAddress} messageUrl={messageUrl} user={this.state.user}/> : null}
      </div>
    );
  },

  onUserSuccess: function() {
    var user;
    chrome.storage.sync.get("user", function(obj){
      user = obj["user"];
    });
    this.setState({user: user});
    this.setState({showAuth: false, showChat: true});
  }

});

React.renderComponent(
  <App/>,
  document.getElementById("content")
);

// /urls/messages/10
// { url: ... }