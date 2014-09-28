/** @jsx React.DOM */

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
    debugger
    console.log(this.props.loginUrl);
    var email = data["email"];
    var password = data["password"];

    $.ajax({
      url: this.props.loginUrl,
      method: 'POST',
      data: $(data).serialize,
      xhrFields: { withCredentials: true }
    })

    .done(function(data) {
      console.log("success");
      if(data["error"]) {
        this.setState({errors: data["error"]});
      } else if(data["user"]) {
        chrome.storage.sync.set({user: data["user"]});
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
      dataType: 'json',
      data: {name: data["name"], email: data["email"], password: data["password"]},
    })

    .done(function(data) {
      console.log("success");
      console.log(data);
      this.props.onSuccess();
    }.bind(this))

    .fail(function() {
      console.log("error");
      this.setState({errors: "register broken..."});      
    }.bind(this))
    
    .always(function() {
      console.log("complete");
    });
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
    debugger
    // var email = this.refs.loginEmail.getDOMNode().value.trim();
    // var password = this.refs.loginPassword.getDOMNode().value.trim();
    var form = this.refs.form.getDOMNode();
    this.props.onLogin($(form));
  },

  render: function() {
    return (
      React.DOM.div({className: "loginForm"}, 
      React.DOM.form({onSubmit: this.handleLogin, ref: "form"}, 
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
    this.props.onRegister({name: name, email: email, password: password});
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

