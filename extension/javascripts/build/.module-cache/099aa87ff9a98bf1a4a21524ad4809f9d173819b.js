/** @jsx React.DOM */

var UserAuth = React.createClass({displayName: 'UserAuth',
  render: function() {
    return (
      React.DOM.div({className: "userAuth"}, 
      React.DOM.div({className: "loginForm"}), 
      React.DOM.div({className: "registerForm"})
      )
    );
  },

  getInitialState: function() {
    return {errors: []};
  }


});

var LoginForm = React.createClass({displayName: 'LoginForm',
  // render: function() {
  //   debugger;
  //   return (
  //     <h3>Login<h3>
  //     <form className="loginForm" onSubmit={this.handleLogin}>
  //     {<p>{this.state.errors}</p>}
  //     <input type="text" placeholder="Email" ref="userEmail"/>
  //     <input type="password" placeholder="Password" ref="userPassword"/>
  //     <input type="submit"/>
  //     </form>
  //    );
  // },

  handleLogin: function(e) {
    e.preventDefault();
    var userEmail = this.refs.userEmail.getDOMNode().value.trim();
    var userPassword = this.refs.userPassword.getDOMNode().value.trim();
    this.refs.onLogin({userEmail: userEmail, userPassword: userPassword});
  }
});

React.renderComponent(
  UserAuth({loginUrl: "...", registerUrl: "..."}),
  document.getElementById("login-register")
);