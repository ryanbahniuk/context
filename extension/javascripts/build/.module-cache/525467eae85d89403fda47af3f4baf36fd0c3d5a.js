/** @jsx React.DOM */

var loginUrl = "http://104.131.117.55:3000/login";
var registerUrl = "http://104.131.117.55:3000/users";
var messageUrl = "http://104.131.117.55:3000/urls/messages/10";
var socketAddress = 'ws://104.131.117.55:8080';

function getStoredUser() {
  var storedUser = {};
  chrome.storage.sync.get("user", function(obj){
    storedUser = obj["user"];
  });
  return storedUser;
}

var App = React.createClass({displayName: 'App',

  getStoredUser: function() {

    // this.setState({user: storedUser}, function() {
    //   console.log(storedUser);
    //   console.log(this.state);
    //   debugger;
    // });
    // return storedUser;
  },

  getInitialState: function() {
    return {
      showAuth: true,
      showChat: false,
      user: {}
    };
  },

  componentDidMount: function() {
    var user = this.getStoredUser();
    this.setState({user: user});
    debugger;
  },

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

React.renderComponent(
  App(null),
  document.getElementById("content")
);

// /urls/messages/10
// { url: ... }