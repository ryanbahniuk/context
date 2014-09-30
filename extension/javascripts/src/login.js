/** @jsx React.DOM */

var user = undefined;

var UserAuth = React.createClass({

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
        this.handleErrors();
      };
    }.bind(this))

    .fail(function() {
      // this.setState({errors: "login broken...", connection: false});
      this.handleErrors();
    }.bind(this))

    .always(function(){
      console.log("waiting");
      this.displayWaiting();
    }.bind(this));
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
        this.handleErrors();        
      };
    }.bind(this))

    .fail(function() {
      console.log("error");
      this.setState({errors: "register broken...", connection: false});      
    }.bind(this))

    .always(function(){
      this.displayWaiting();
    }.bind(this));
  },

  displayWaiting: function() {
    if(this.isMounted()){
      this.setState({waiting: true});
    };
  },

  handleErrors: function() {
    console.log("handling errors");
    this.setState({connection: false});
    this.forceUpdate();
  },

  handleReload: function() {
    console.log("handling reload");
    this.setState({connection: true, waiting: false});
  },

  render: function() {
    if(this.state.connection===true) {
      return (
        <div className="userAuth">
        <DisplayErrors errors={this.state.errors}/>
        { this.state.showLogin ? <LoginForm onLogin={this.handleLoginRequest} onSwitchRegister={this.onClickRegister}/> : null }
        { this.state.showRegister ? <RegisterForm onRegister={this.handleRegisterRequest} onSwitchLogin={this.onClickLogin}/> : null }
        { this.state.waiting ? <AuthWaiting/> : null}
        </div>
      );
    } else {
      return(
        <div className="userAuth">
          <LoginConnection onReload={this.handleReload}/> 
          <ReportConnection onSend={this.props.onConnectionReport} onReload={this.handleReload}/>
        </div>
      );
    };
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

var AuthWaiting = React.createClass({
  render: function() {
    return(
      <div className="authWaiting">
        <i className="fa fa-circle-o-notch fa-spin fa-4x"></i>
      </div>
    );
  }
});

var ReportConnection = React.createClass({
  getInitialState: function() {
    return {submitted: false};
  },

  onSend: function(e) {
    e.preventDefault();
    this.setState({submitted: true});
    var form = this.refs.connectionForm.getDOMNode();
    this.props.onSend($(form));
    setTimeout(function() {
      this.props.onReload()}.bind(this), 1500);
  },

  render: function() {
    if(this.state.submitted) {
      return (
        <div className="reportConnection">
          <p>Thanks</p>
        </div>
      );
    } else {
      return (
        <form className="reportConnection" ref="connectionForm" onClick={this.onSend}>
          <input type="hidden" name="url" value={url}/>
          <input type="hidden" name="type" value="chat_connection"/>
          <textarea placeholder="Help us fix bugs. Describe what you were doing when the connection was lost." name="description"></textarea>
          <input type="submit"/>
        </form>   
      );
    }
  }
})


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
      <button onClick={this.props.onSwitchRegister}>Sign Up</button>
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
      <input type="password" placeholder="Password" name="user[password]" />
      <input type="submit" value="Sign Up"/>
      </form>
      <button onClick={this.props.onSwitchLogin}>Login</button>
      </div>
    );
  }
});

var LoginConnection = React.createClass({
  render: function() {
    return (
      <div className="loginConnection connection">
        <i className="fa fa-frown-o fa-5x"></i> 
        <p>Something went wrong</p>
        <button onClick={this.props.onReload}>Reload</button>
      </div> 
    );
  }
});

