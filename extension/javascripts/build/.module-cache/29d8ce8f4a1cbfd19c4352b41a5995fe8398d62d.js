/** @jsx React.DOM */

var loginUrl = "...";
var registerUrl = "...";

var App = React.createClass({displayName: 'App',
  render: function() {
    UserAuth({loginUrl: loginUrl, registerUrl: registerUrl})
  }

});

React.renderComponent(
  App(null),
  document.getElementById("content")
);