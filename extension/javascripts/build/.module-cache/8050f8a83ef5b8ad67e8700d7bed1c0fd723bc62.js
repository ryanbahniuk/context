/** @jsx React.DOM */

var loginUrl = "...";
var registerUrl = "...";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({displayName: 'App',

  render: function() {
    return(
      React.DOM.div({className: "App"}, 
      this.state.showAuth ? UserAuth({loginUrl: loginUrl, registerUrl: registerUrl, onSuccess: this.onUserSuccess}) : null, 
      this.state.showChat ? ChatBox({socketAddress: socketAddress}) : null
      )
    );
  },

  getInitialState: function() {
    return {
      showAuth: true,
      showChat: false
    };
  }

});

React.renderComponent(
  App(null),
  document.getElementById("content")
);