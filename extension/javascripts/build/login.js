/** @jsx React.DOM */

var user = undefined;

var UserAuth = React.createClass({displayName: 'UserAuth',

  getInitialState: function() {
    return {
      errors: "",
      showLogin: true,
      showRegister: false,
      connection: true
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
        this.props.onSuccess(data["user"]);
      } else {
        this.setState({errors: "??????"});
      };
    }.bind(this))

    .fail(function() {
      console.log("error");
      this.setState({errors: "login broken...", connection: false});
      this.handleErrors();
    }.bind(this))
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
        this.props.onSuccess(data["user"]);
      }
      else {
        this.setState({errors: "??????"});        
      };
    }.bind(this))

    .fail(function() {
      console.log("error");
      this.setState({errors: "register broken...", connection: false});      
    }.bind(this))
  },

  handleErrors: function() {
    console.log("handling errors");
    this.setState({connection: false});
  },

  handleTryAgain: function() {
    this.setState({connection: true});
  },

  render: function() {
    if(this.state.connection) {
      return (
        React.DOM.div({className: "userAuth"}, 
        DisplayErrors({errors: this.state.errors}), 
         this.state.showLogin ? LoginForm({onLogin: this.handleLoginRequest, onSwitchRegister: this.onClickRegister}) : null, 
         this.state.showRegister ? RegisterForm({onRegister: this.handleRegisterRequest, onSwitchLogin: this.onClickLogin}) : null
        )
      );
    } else {
      return(
        React.DOM.div({className: "userAuth"}, 
          LoginConnection({tryAgain: this.handleTryAgain})
        )
      );
    };
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
      React.DOM.button({onClick: this.props.onSwitchRegister}, "Sign Up")
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
      React.DOM.input({type: "password", placeholder: "Password", name: "user[password]"}), 
      React.DOM.input({type: "submit", value: "Sign Up"})
      ), 
      React.DOM.button({onClick: this.props.onSwitchLogin}, "Login")
      )
    );
  }
});

var LoginConnection = React.createClass({displayName: 'LoginConnection',
  render: function() {
    return (
      React.DOM.div({className: "LoginConnection connection"}, 
        React.DOM.i({className: "fa fa-frown-o"}), 
        React.DOM.button({onClick: this.props.tryAgain}, "Go Back")
      ) 
    );
  }
});

