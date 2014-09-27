/** @jsx React.DOM */

var LoginForm = React.createClass({displayName: 'LoginForm',
  render: function() {
    return (
      React.DOM.input({type: "text", defaultValue: "Email"})
     );
  }
});

React.renderComponent(
  LoginForm(null),
  document.getElementById("content")
);