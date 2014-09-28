/** @jsx React.DOM */

var loginUrl = "http://104.131.117.55:3000/login";
var registerUrl = "http://104.131.117.55:3000/users";
var messageUrl = "http://104.131.117.55:3000/urls/messages/10";
var socketAddress = 'ws://104.131.117.55:8080';

// function getStoredUser() {

// };

// function sleep(millis, callback) {
//   setTimeout(function() {
//     callback();
//   }, millis);
// }

var App = React.createClass({displayName: 'App',

  getInitialState: function() {
    if(user !== undefined) {
      return { showAuth: false, showChat: true, user: user };
    } else {
      return { showAuth: true, showChat: true, user: user };
    };
  },

  // componentDidMount: function() {
  //   var user = getStoredUser();
  //   this.setState({user: user});
  // },

  onUserSuccess: function() {
    var user;
    chrome.storage.sync.get("user", function(obj){
      user = obj["user"];
    });
    this.setState({user: user});
    this.setState({showAuth: false, showChat: true});
  },

  render: function() {
    return(
      React.DOM.div({className: "App"}, 
      this.state.showAuth ? UserAuth({loginUrl: loginUrl, registerUrl: registerUrl, onSuccess: this.onUserSuccess}) : null, 
      this.state.showChat ? ChatBox({socketAddress: socketAddress, messageUrl: messageUrl, user: this.state.user}) : null
      )
    );
  }

});

var run = function() {
  React.renderComponent(
    App(null),
    document.getElementById("content")
  );
};

chrome.storage.sync.get("user", function(obj){
  user = obj["user"];
  run();
});
// /urls/messages/10
// { url: ... }