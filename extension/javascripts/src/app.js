/** @jsx React.DOM */

var httpServer = "http://104.131.117.55:3000/";
var loginUrl = httpServer + "login";
var registerUrl = httpServer + "users";
var messageUrl = httpServer + "urls/messages/10";
var errorReportUrl = httpServer + "error/";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({

  getInitialState: function() {
    if(user !== undefined) {
      return { showSettings: false, userPresent: true };
    } else {
      return { showSettings: false, userPresent: false };
    };
  },

  onUserSuccess: function(u) {
    user = u;
    this.setState({userPresent: true});
  },

  handleClickSettings: function() {
    if(this.state.showSettings === false) {
      this.setState({showSettings: true});
    } else {
      this.setState({showSettings: false});
    };
  },

  handleClickLogout: function() {
    chrome.storage.sync.clear();
    user = undefined;
    this.setState({showSettings: false, userPresent: false});
  },

  render: function() {
    return(
      <div className="App">

      {this.state.userPresent ? <SettingsButton clickSettings={this.handleClickSettings}/> : null}

      {this.state.showSettings ? <SettingsPanel clickLogout={this.handleClickLogout} clickView={this.handleClickView}/> : null}

      {this.state.userPresent ? <ChatBox socketAddress={socketAddress} messageUrl={messageUrl} user={user}/> : <UserAuth loginUrl={loginUrl} registerUrl={registerUrl} onSuccess={this.onUserSuccess}/> }
      </div>
    );
  },

});

var SettingsButton = React.createClass({
  render: function() {
    return (
      <i className="settingsButton fa fa-cog" onClick={this.props.clickSettings}></i>
    );
  }
});

var SettingsPanel = React.createClass({
  onReportSend: function() {
    this.setSate({reportSent: true});
  },

  getInitialState: function() {
    return ({reportSent: false});
  },

  render: function() {
    return (
      <div className="settingsPanel">
        <div className="button" onClick={this.props.clickLogout}>Logout</div>
        {/* <div className="button" onClick={this.props.clickView}>Change View</div> */}
        <ReportError onSend={this.onReportSend}/>
        { this.state.reportSent ? <ReportDetails/> : null }
      </div>
    );
  }
});

var ReportError = React.createClass({
  sendReport: function() {
    $.ajax({
      url: errorReportUrl + url,
      type: 'post',
      dataType: 'text'
    })
    .done(function() {
      console.log("report sent");
      this.props.onSend;
      this.setState({reportSent: true});
    }.bind(this))
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log(errorReportUrl + url);
    }); 
  },

  getInitialState: function() {
    return ( {reportSent: false} );
  },

  render: function() {
    return (
      <div className="reportError">
        {this.state.reportSent ? <div className="report_sent button">Report Sent</div>  : <div className="button" onClick={this.sendReport}>Report Page Error</div>}
      </div>
    );
  }
});

var ReportDetails = React.createClass({
  render: function() {
    <div className="reportDetails">
      <textarea placeholder="Details?"></textarea>
      <input type="submit"/>
    </div>
  }
});

var ConnectionStatus = React.createClass({
  render: function() {
    return (
      <div id="status">Disconnected</div>
    );
  }
});

function run() {
  React.renderComponent(
    <App/>,
    document.getElementById("content")
  );
};


chrome.storage.sync.get("user", function(obj){
  user = obj["user"];
  run();
});