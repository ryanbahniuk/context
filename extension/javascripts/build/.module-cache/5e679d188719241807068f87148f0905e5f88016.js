/** @jsx React.DOM */

var LoginForm = React.createClass({displayName: 'LoginForm',
  render: function() {
    return (
      React.DOM.form({className: "loginForm", onSubmit: this.handleSubmit}, 
      React.DOM.input({type: "text", placeholder: "Email", ref: "userEmail"}), 
      React.DOM.input({type: "password", placeholder: "Password", ref: "userPassword"}), 
      React.DOM.input({type: "submit"})
      )
     );
  },

  handleSubmit: function() {
    e.preventDefault();
    var userEmail = this.refs.userEmail.getDOMNode().value.trim();
    var userPassword = this.refs.userPassword.getDOMNode().value.trim();
  }
});

React.renderComponent(
  LoginForm(null),
  document.getElementById("content")
);