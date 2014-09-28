/** @jsx React.DOM */

var loginUrl = "/login";
var registerUrl = "/users";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({displayName: 'App',

  getInitialState: function() {
    return {
      showAuth: false,
      showChat: true
    };
  },

  render: function() {
    return(
      React.DOM.div({className: "App"}, 
      this.state.showAuth ? UserAuth({loginUrl: loginUrl, registerUrl: registerUrl, onSuccess: this.onUserSuccess}) : null, 
      this.state.showChat ? ChatBox({socketAddress: socketAddress}) : null
      )
    );
  },

  onUserSuccess: function() {
    this.setState({showAuth: false, showChat: true});
  }

});

React.renderComponent(
  App(null),
  document.getElementById("content")
);

// /urls/messages/10
// { url: ... }