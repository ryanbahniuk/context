/** @jsx React.DOM */

var UserAuth = React.createClass({

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
    var url = this.props.loginUrl;
    $.ajax(url, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      data: $(data).serialize();
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
      debugger;
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
      <div className="userAuth">
        <DisplayErrors errors={this.state.errors}/>
      { this.state.showLogin ? <LoginForm onLogin={this.handleLoginRequest} onSwitchRegister={this.onClickRegister}/> : null }
      { this.state.showRegister ? <RegisterForm onRegister={this.handleRegisterRequest} onSwitchLogin={this.onClickLogin}/> : null }
      </div>
    );
  }
});

var DisplayErrors = React.createClass({
  render: function() {
    return (
    <div className="displayErrors">
      <p>{this.props.errors}</p>
    </div>
    );
  }
});

var LoginForm = React.createClass({

  handleLogin: function(e, d) {
    debugger
    e.preventDefault();
    var email = this.refs.loginEmail.getDOMNode().value.trim();
    var password = this.refs.loginPassword.getDOMNode().value.trim();
    this.props.onLogin({email: email, password: password});
  },

  render: function() {
    return (
      <div className="loginForm">
      <form onSubmit={this.handleLogin}>
        <input type="text" placeholder="Email" ref="loginEmail"/>
        <input type="password" placeholder="Password" ref="loginPassword"/>
        <input type="submit"/>
      </form>
      <button onClick={this.props.onSwitchRegister}>Register</button>
      </div>
     );
  }
});

var RegisterForm = React.createClass({

  handleRegister: function(e) {
    e.preventDefault();
    var name = this.refs.registerName.getDOMNode().value.trim();
    var email = this.refs.registerEmail.getDOMNode().value.trim();
    var password = this.refs.registerPassword.getDOMNode().value.trim();
    this.props.onRegister({name: name, email: email, password: password});
  },

  render: function() {
    return (
      <div className="registerForm">
      <form onSubmit={this.handleRegister}>
      <input type="text" placeholder="Name" ref="registerName"/>
      <input type="text" placeholder="Email" ref="registerEmail"/>
      <input type="text" placeholder="Password" ref="registerPassword"/>
      <input type="submit"/>
      </form>
      <button onClick={this.props.onSwitchLogin}>Login</button>
      </div>
      );
  }
});

