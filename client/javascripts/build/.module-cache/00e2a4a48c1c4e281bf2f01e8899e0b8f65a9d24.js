/** @jsx React.DOM */

var UserAuth = React.createClass({displayName: 'UserAuth',

  getInitialState: function() {
    return {errors: []};
  },

  render: function() {
    return (
      React.DOM.div({className: "userAuth"}, 
      React.DOM.div({className: "loginForm", onLogin: this.handleLoginRequest}), 
      React.DOM.div({className: "registerForm"})
      )
    );
  }
});

var LoginForm = React.createClass({displayName: 'LoginForm',

  handleLogin: function(e) {
    e.preventDefault();
    var userEmail = this.refs.userEmail.getDOMNode().value.trim();
    var userPassword = this.refs.userPassword.getDOMNode().value.trim();
    this.refs.onLogin({userEmail: userEmail, userPassword: userPassword});
  },

  render: function() {
    return (
      React.DOM.form({className: "loginForm", onSubmit: this.handleLogin}, 
      React.DOM.p(null, this.state.errors), 
      React.DOM.input({type: "text", placeholder: "Email", ref: "userEmail"}), 
      React.DOM.input({type: "password", placeholder: "Password", ref: "userPassword"}), 
      React.DOM.input({type: "submit"})
      )
     );
  }
});

React.renderComponent(
  UserAuth({loginUrl: "...", registerUrl: "..."}),
  document.getElementById("login-register")
);