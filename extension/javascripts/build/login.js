/** @jsx React.DOM */
var user;

var UserAuth = React.createClass({displayName: 'UserAuth',

  getInitialState: function() {
    return {
      errors: "",
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
    var url = this.props.loginUrl;
    $.ajax(url, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      data: data.serialize()
    })

    .done(function(data) {
      if(data["error"]) {
        this.setState({errors: data["error"]});
      } else if(data["user"]) {
        chrome.storage.sync.set({"user": data["user"]});
        this.props.onSuccess();
      } else {
        this.setState({errors: "??????"});
      };
    }.bind(this))

    .fail(function() {
      console.log("error");
      this.setState({errors: "login broken..."});
    }.bind(this))

    .always(function() {
      console.log("complete");
    });
  },

  handleRegisterRequest: function(data) {
    $.ajax({
      url: this.props.registerUrl,
      type: 'POST',
      contentType: "application/x-www-form-urlencoded",
      data: data.serialize(),
    })

    .done(function(data) {
      if(data["error"]) {
        this.setState({errors: data["error"]});
      }
      else if(data["user"]) {
        chrome.storage.sync.set({"user": data["user"]});
        console.log(data["user"]);
        this.props.onSuccess();
      }
      else {
        this.setState({errors: "??????"});        
      };
    }.bind(this))

    .fail(function() {
      console.log("error");
      this.setState({errors: "register broken..."});      
    }.bind(this))
  },

  render: function() {
    return (
      React.DOM.div({className: "userAuth"}, 
        DisplayErrors({errors: this.state.errors}), 
       this.state.showLogin ? LoginForm({onLogin: this.handleLoginRequest, onSwitchRegister: this.onClickRegister}) : null, 
       this.state.showRegister ? RegisterForm({onRegister: this.handleRegisterRequest, onSwitchLogin: this.onClickLogin}) : null
      )
    );
  }
});

var DisplayErrors = React.createClass({displayName: 'DisplayErrors',
  render: function() {
    return (
    React.DOM.div({className: "displayErrors"}, 
      React.DOM.p(null, this.props.errors)
    )
    );
  }
});

var LoginForm = React.createClass({displayName: 'LoginForm',

  handleLogin: function(e) {
    e.preventDefault();
    var form = this.refs.loginForm.getDOMNode();
    this.props.onLogin($(form));
  },

  render: function() {
    return (
      React.DOM.div({className: "loginForm"}, 
      React.DOM.form({onSubmit: this.handleLogin, ref: "loginForm"}, 
        React.DOM.input({type: "text", placeholder: "Email", name: "email"}), 
        React.DOM.input({type: "password", placeholder: "Password", name: "password"}), 
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
    var form = this.refs.form.getDOMNode();
    this.props.onRegister($(form));
  },

  render: function() {
    return (
      React.DOM.div({className: "registerForm"}, 
      React.DOM.form({onSubmit: this.handleRegister, ref: "form"}, 
      React.DOM.input({type: "text", placeholder: "Name", name: "user[name]"}), 
      React.DOM.input({type: "text", placeholder: "Email", name: "user[email]"}), 
      React.DOM.input({type: "text", placeholder: "Password", name: "user[password]"}), 
      React.DOM.input({type: "submit"})
      ), 
      React.DOM.button({onClick: this.props.onSwitchLogin}, "Login")
      )
    );
  }
});
