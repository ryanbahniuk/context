/** @jsx React.DOM */

var UserAuth = React.createClass({displayName: 'UserAuth',

  getInitialState: function() {
    return {
      errors: "",
      showLogin: true,
      showRegister: false,
      connection: true,
      waiting: false
    };
  },

  onClickRegister: function() {
    this.setState({showRegister: true, showLogin: false, errors: "", waiting: false});
  },

  onClickLogin: function() {
    this.setState({showLogin: true, showRegister: false, errors: "", waiting: false});
  },

  handleLoginRequest: function(data) {
    this.displayWaiting(true);

    var url = loginUrl;
    $.ajax(url, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      data: data.serialize()
    })

    .done(function(data) {
      this.displayWaiting(false);
      if(data["error"]) {
        this.setState({errors: data["error"]});
      } else if(data["cookie"]) {
        this.props.onSuccess(data["cookie"]);
      } else {
        this.handleErrors();
      };
    }.bind(this))

    .fail(function() {
      this.handleErrors();
    }.bind(this))
  },

  handleRegisterRequest: function(data) {
    this.displayWaiting(true);
    var url = registerUrl;

    $.ajax({
      url: url,
      type: 'POST',
      contentType: "application/x-www-form-urlencoded",
      data: data.serialize(),
    })

    .done(function(data) {
      this.displayWaiting(false);
      if(data["error"]) {
        this.setState({errors: data["error"]});
      }
      else if(data["cookie"]) {
        this.props.onSuccess(data["cookie"]);
      }
      else {
        this.handleErrors();
      };
    }.bind(this))

    .fail(function() {
      this.handleErrors();
    }.bind(this))
  },

  displayWaiting: function(status) {
    if(this.isMounted()){
      this.setState({waiting: status});
    };
  },

  handleErrors: function() {
    console.log("handling errors");
    this.setState({connection: false});
    this.displayWaiting(false);
    this.forceUpdate();
  },

  handleReload: function() {
    console.log("handling reload");
    this.setState({connection: true, waiting: false});
  },

  render: function() {
    if(this.state.connection===true) {
      return (
        React.DOM.div({className: "userAuth"}, 
        DisplayErrors({errors: this.state.errors}), 
         this.state.showLogin ? LoginForm({onLogin: this.handleLoginRequest, onSwitchRegister: this.onClickRegister}) : null, 
         this.state.showRegister ? RegisterForm({onRegister: this.handleRegisterRequest, onSwitchLogin: this.onClickLogin}) : null, 
         this.state.waiting ? AuthWaiting(null) : null
        )
      );
    } else {
      return(
        React.DOM.div({className: "userAuth"}, 
          LoginConnection({onReload: this.handleReload}), 
          ReportConnection({onSend: this.props.onConnectionReport, onReload: this.handleReload})
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

var AuthWaiting = React.createClass({displayName: 'AuthWaiting',
  render: function() {
    return(
      React.DOM.div({className: "authWaiting"}, 
        React.DOM.i({className: "fa fa-circle-o-notch fa-spin fa-4x"})
      )
    );
  }
});

var ReportConnection = React.createClass({displayName: 'ReportConnection',
  getInitialState: function() {
    return {submitted: false};
  },

  onClickSubmit: function(e) {
    e.preventDefault();
    this.setState({submitted: true});
    var form = this.refs.connectionForm.getDOMNode();
    debugger;
    this.props.onSend($(form));
    setTimeout(function() {
      this.props.onReload()}.bind(this), 1500);
  },

  render: function() {
    if(this.state.submitted) {
      return (
        React.DOM.div({className: "reportConnection"}, 
          React.DOM.p(null, "Thanks")
        )
      );
    } else {
      return (
        React.DOM.form({className: "reportConnection", ref: "connectionForm", onSubmit: this.onClickSubmit}, 
          React.DOM.input({type: "hidden", name: "url", value: url}), 
          React.DOM.input({type: "hidden", name: "type", value: "chat_connection"}), 
          React.DOM.textarea({placeholder: "Help us fix bugs. Describe what you were doing when the connection was lost.", name: "description"}), 
          React.DOM.input({type: "submit"})
        )
      );
    }
  }
})


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
      React.DOM.div({className: "loginConnection connection"}, 
        React.DOM.i({className: "fa fa-frown-o fa-5x"}), 
        React.DOM.p(null, "Something went wrong"), 
        React.DOM.button({onClick: this.props.onReload}, "Reload")
      )
    );
  }
});

