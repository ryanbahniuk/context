/** @jsx React.DOM */

var Login = React.createClass({displayName: 'Login',
  render: function() {
    return (
      React.DOM.input({type: "text", defaultValue: "Email"})
     );
  }
});

React.renderComponent(
  Login(null),
  document.getElementById("content")
);