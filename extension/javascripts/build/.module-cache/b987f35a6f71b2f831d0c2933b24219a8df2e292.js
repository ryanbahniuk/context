/** @jsx React.DOM */

var App = React.createClass({displayName: 'App',
  render: function() {
    UserAuth(null)
  }
});

React.renderComponent(
  App(null),
  document.getElementById("content")
);