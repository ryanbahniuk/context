/** @jsx React.DOM */

var loginUrl = "http://104.131.117.55:3000/login";
var registerUrl = "http://104.131.117.55:3000/users";
var messageUrl = "http://104.131.117.55:3000/urls/messages/10";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({

  getInitialState: function() {
    if(user !== undefined) {
      return { showAuth: false, showChat: true, showSettings: false };
    } else {
      return { showAuth: true, showChat: true, showSettings: false };
    };
  },

  onUserSuccess: function() {
    this.setState({showAuth: false, showChat: true});
  },

  render: function() {
    return(
      <div className="App">
      <TitleBar/>
      {this.state.showChat ? <SettingsButton/> : null}
      {this.state.showSettings ? <SettingsPanel/> : null}
      {this.state.showAuth ? <UserAuth loginUrl={loginUrl} registerUrl={registerUrl} onSuccess={this.onUserSuccess}/> : null }
      {this.state.showChat ? <ChatBox socketAddress={socketAddress} messageUrl={messageUrl} user={user}/> : null}
      </div>
    );
  }
});

var TitleBar = React.createClass({
  render: function() {
    return (
      <div className="titleBar">(0|\|+3x+
      </div>
    );
  }
});

var SettingsButton = React.createClass({
  render: function() {
    return (
      <i className="settingsButton fa fa-cog"></i>
    );
  }
});

var SettingsPanel = React.createClass({
  render: function() {
    return (
      <div className="settingsPanel">
      </div>
    );
  }
});

function run() {
  React.renderComponent(
    <App/>,
    document.getElementById("content")
  );
};

chrome.storage.sync.get("user", function(obj){
  user = obj["user"];
  run();
});