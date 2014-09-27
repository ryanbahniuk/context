/** @jsx React.DOM */

var UserAuth = React.createClass({displayName: 'UserAuth',

  getInitialState: function() {
    return {
      errors: [],
      showLogin: true,
      showRegister: false
    };
  },

  onClickRegister: function() {
    this.setState({showRegister: true, showLogin: false});
  },

  onClickLogin: function() {
    this.setState({showLogin: true, showRegister: false});
  },

  handleLoginRequest: function(data) {
    $.ajax({
      url: this.props.loginUrl,
      type: 'GET',
      dataType: 'json',
      data: {email: data["email"], password: data["password"]},
    })
    .done(function() {
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    

  },

  handleRegisterRequest: function() {
    $.ajax({
      url: this.props.registerUrl,
      type: 'POST',
      dataType: 'json',
      data: {name: data["name"], email: data["email"], password: data["password"]},
    })
    .done(function() {
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  },

  render: function() {
    return (
      React.DOM.div({className: "userAuth"}, 
       this.state.showLogin ? LoginForm({onLogin: this.handleLoginRequest, onSwitchRegister: this.onClickRegister}) : null, 
       this.state.showRegister ? RegisterForm({onRegist: this.handleRegisterRequest, onSwitchLogin: this.onClickLogin}) : null
      )
    );
  }
});

var LoginForm = React.createClass({displayName: 'LoginForm',

  handleLogin: function(e) {
    e.preventDefault();
    var email = this.refs.loginEmail.getDOMNode().value.trim();
    var password = this.refs.loginPassword.getDOMNode().value.trim();
    this.refs.onLogin({email: email, password: password});
  },

  render: function() {
    return (
      React.DOM.div({className: "loginForm"}, 
      React.DOM.form({onSubmit: this.handleLogin}, 
        React.DOM.input({type: "text", placeholder: "Email", ref: "loginEmail"}), 
        React.DOM.input({type: "password", placeholder: "Password", ref: "loginPassword"}), 
        React.DOM.input({type: "submit"})
      ), 
      React.DOM.button({onClick: this.props.onSwitchRegister}, "Register")
      )
     );
  }
});

var RegisterForm = React.createClass({displayName: 'RegisterForm',

  handleRegister: function(e) {
    e.preventDefault();
    var name = this.refs.registerName.getDOMNode().value.trim();
    var email = this.refs.registerEmail.getDOMNode().value.trim();
    var password = this.refs.registerPassword.getDOMNode().value.trim();
    this.refs.onRegister({name: name, email: email, password: password});
  },

  render: function() {
    return (
      React.DOM.div({className: "registerForm"}, 
      React.DOM.form({onSubmit: this.handleRegister}, 
      React.DOM.input({type: "text", placeholder: "Name", ref: "registerName"}), 
      React.DOM.input({type: "text", placeholder: "Email", ref: "registerEmail"}), 
      React.DOM.input({type: "text", placeholder: "Password", ref: "registerPassword"}), 
      React.DOM.input({type: "submit"})
      ), 
      React.DOM.button({onClick: this.props.onSwitchLogin}, "Login")
      )
      );
  }
});

