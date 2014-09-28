/** @jsx React.DOM */

var loginUrl = "http://104.131.117.55:3000/login";
var registerUrl = "http://104.131.117.55:3000/users";
var messageUrl = "http://104.131.117.55:3000/urls/messages/10";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({displayName: 'App',

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
      React.DOM.div({className: "App"}, 
      TitleBar(null), 
      this.state.userPresent ? SettingsButton({clickSettings: this.handleClickSettings}) : null, 
      this.state.showSettings ? SettingsPanel({clickLogout: this.handleClickLogout, clickView: this.handleClickView}) : null, 
      this.state.userPresent ? ChatBox({socketAddress: socketAddress, messageUrl: messageUrl, user: user}) : UserAuth({loginUrl: loginUrl, registerUrl: registerUrl, onSuccess: this.onUserSuccess})
      )
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

var TitleBar = React.createClass({displayName: 'TitleBar',
  render: function() {
    return (
      React.DOM.div({className: "titleBar"}, "(0|\\|+3x+")
    );
  }
});

var SettingsButton = React.createClass({displayName: 'SettingsButton',
  render: function() {
    return (
      React.DOM.i({className: "settingsButton fa fa-cog", onClick: this.props.clickSettings})
    );
  }
});

var SettingsPanel = React.createClass({displayName: 'SettingsPanel',
  render: function() {
    return (
      React.DOM.div({className: "settingsPanel"}, 
        React.DOM.button({className: "logoutButton", onClick: this.props.clickLogout}, "Logout"), 
        React.DOM.div({className: "viewButton", onClick: this.props.clickView}, "Change View")
      )
    );
  }
});

function run() {
  React.renderComponent(
    App(null),
    document.getElementById("content")
  );
};

chrome.storage.sync.get("user", function(obj){
  user = obj["user"];
  run();
});