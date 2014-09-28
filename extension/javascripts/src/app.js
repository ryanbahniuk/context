/** @jsx React.DOM */

var loginUrl = "http://104.131.117.55:3000/login";
var registerUrl = "http://104.131.117.55:3000/users";
var messageUrl = "http://104.131.117.55:3000/urls/messages/10";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({

  getInitialState: function() {
    if(user !== undefined) {
      return { showSettings: false, userPresent: true };
    } else {
      return { showSettings: false, userPresent: false };
    };
  },

  onUserSuccess: function(u) {
    this.setState({showChat: true, showAuth: false, userPresent: true});
  },

  handleClickSettings: function() {
    if(this.state.showSettings === false) {
      this.setState({showSettings: true});
    } else {
      this.setState({showSettings: false});
    };
  },

  handleClickLogout: function() {
    chrome.storage.sync.clear();
    user = undefined;
    this.setState({showSettings: false, userPresent: false});
  },

  render: function() {
    return(
      <div className="App">
      <TitleBar/>
      {this.state.userPresent ? <SettingsButton clickSettings={this.handleClickSettings}/> : null}
      {this.state.showSettings ? <SettingsPanel clickLogout={this.handleClickLogout} clickView={this.handleClickView}/> : null}
      {this.state.userPresent ? <ChatBox socketAddress={socketAddress} messageUrl={messageUrl} user={user}/> : <UserAuth loginUrl={loginUrl} registerUrl={registerUrl} onSuccess={this.onUserSuccess}/> }
      </div>
    );
  },

  //   render: function() {
  //   return(
  //     <div className="App">
  //     <TitleBar/>
  //     {this.state.showChat ? <SettingsButton clickSettings={this.handleClickSettings}/> : null}
  //     {this.state.showSettings ? <SettingsPanel clickLogout={this.handleClickLogout} clickView={this.handleClickView}/> : null}
  //     {this.state.showChat ? <ChatBox socketAddress={socketAddress} messageUrl={messageUrl} user={user}/> : null}
  //     {this.state.showAuth ? <UserAuth loginUrl={loginUrl} registerUrl={registerUrl} onSuccess={this.onUserSuccess}/> : null}
  //     </div>
  //   );
  // }
});

var TitleBar = React.createClass({
  render: function() {
    return (
      <div className="titleBar">(0|\|+3x+</div>
    );
  }
});

var SettingsButton = React.createClass({
  render: function() {
    return (
      <i className="settingsButton fa fa-cog" onClick={this.props.clickSettings}></i>
    );
  }
});

var SettingsPanel = React.createClass({
  render: function() {
    return (
      <div className="settingsPanel">
        <button className="logoutButton" onClick={this.props.clickLogout}>Logout</button>
        <div className="viewButton" onClick={this.props.clickView}>Change View</div>
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