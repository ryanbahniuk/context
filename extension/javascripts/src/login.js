/** @jsx React.DOM */
var user;

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
        this.props.onSuccess(data["user"]);
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
        this.props.onSuccess(data["user"]);
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

  handleLogin: function(e) {
    e.preventDefault();
    var form = this.refs.loginForm.getDOMNode();
    this.props.onLogin($(form));
  },

  render: function() {
    return (
      <div className="loginForm">
      <form onSubmit={this.handleLogin} ref="loginForm">
        <input type="text" placeholder="Email" name="email"/>
        <input type="password" placeholder="Password" name="password"/>
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
    var form = this.refs.form.getDOMNode();
    this.props.onRegister($(form));
  },

  render: function() {
    return (
      <div className="registerForm">
      <form onSubmit={this.handleRegister} ref="form">
      <input type="text" placeholder="Name" name="user[name]" />
      <input type="text" placeholder="Email" name="user[email]" />
      <input type="text" placeholder="Password" name="user[password]" />
      <input type="submit"/>
      </form>
      <button onClick={this.props.onSwitchLogin}>Login</button>
      </div>
    );
  }
});

