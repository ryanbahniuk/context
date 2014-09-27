/** @jsx React.DOM */

var UserAuth = React.createClass({

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
      <div className="userAuth">
      { this.state.showLogin ? <LoginForm onLogin={this.handleLoginRequest} onSwitchRegister={this.onClickRegister}/> : null }
      { this.state.showRegister ? <RegisterForm onRegist={this.handleRegisterRequest} onSwitchLogin={this.onClickLogin}/> : null }
      </div>
    );
  }
});

var LoginForm = React.createClass({

  handleLogin: function(e) {
    e.preventDefault();
    var email = this.refs.loginEmail.getDOMNode().value.trim();
    var password = this.refs.loginPassword.getDOMNode().value.trim();
    this.refs.onLogin({email: email, password: password});
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
    var email = this.refs.registerEmail.getDOMNode().value.trim();
    var password = this.refs.registerPassword.getDOMNode().value.trim();
     
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

