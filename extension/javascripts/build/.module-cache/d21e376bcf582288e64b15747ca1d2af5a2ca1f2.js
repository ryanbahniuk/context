/** @jsx React.DOM */

var UserAuth = React.createClass({displayName: 'UserAuth',

  getInitialState: function() {
    return {errors: []};
  },

  render: function() {
    return (
      React.DOM.div({className: "userAuth"}, 
      LoginForm({onLogin: this.handleLoginRequest}), 
      RegisterForm(null)
      )
    );
  }
});

var LoginForm = React.createClass({displayName: 'LoginForm',

  handleLogin: function(e) {
    e.preventDefault();
    var loginEmail = this.refs.loginEmail.getDOMNode().value.trim();
    var loginPassword = this.refs.loginPassword.getDOMNode().value.trim();
    this.refs.onLogin({loginEmail: loginEmail, loginPassword: loginPassword});
  },

  render: function() {
    return (
      React.DOM.form({className: "loginForm", onSubmit: this.handleLogin}, 
        React.DOM.p(null, this.state.errors), 
        React.DOM.input({type: "text", placeholder: "Email", ref: "loginEmail"}), 
        React.DOM.input({type: "password", placeholder: "Password", ref: "loginPassword"}), 
        React.DOM.input({type: "submit"})
      )
     );
  }
});

var RegisterForm = React.createClass({displayName: 'RegisterForm',
  render: function() {
    return (
      React.DOM.form({className: "registerForm", onSubmit: this.handleRegister}, 
      React.DOM.p(null, this.state.errors), 
      React.DOM.input({type: "text", placeholder: "Name", ref: "registerName"}), 
      React.DOM.input({type: "text", placeholder: "Email", ref: "registerEmail"}), 
      React.DOM.input({type: "text", placeholder: "Password", ref: "registerPassword"})
      )
      );
  }
})

React.renderComponent(
  UserAuth({loginUrl: "...", registerUrl: "..."}),
  document.getElementById("login-register")
);