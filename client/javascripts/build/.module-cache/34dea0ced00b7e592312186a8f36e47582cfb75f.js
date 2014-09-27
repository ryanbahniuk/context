/** @jsx React.DOM */

var LoginForm = React.createClass({displayName: 'LoginForm',
  render: function() {
    return (
      React.DOM.form({className: "loginForm", onSubmit: this.handleSubmit}, 
      React.DOM.input({type: "text", placeholder: "Email"}), 
      React.DOM.input({type: "password", placeholder: "Password"})
      )
     );
  }
});

React.renderComponent(
  LoginForm(null),
  document.getElementById("content")
);