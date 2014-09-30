/** @jsx React.DOM */

// var httpServer = "http://104.131.117.55:3000/";
var httpServer = "http://localhost:3000/";
var loginUrl = httpServer + "login";
var registerUrl = httpServer + "users";
var messageUrl = httpServer + "urls/messages/10";
var errorReportUrl = httpServer + "error";
var socketAddress = 'ws://localhost:8080';

var App = React.createClass({

  getInitialState: function() {
    if(user !== undefined) {
      return { showSettings: false, reportSent: false, detailsSent: false, userPresent: true, errorId: 0 };
    } else {
      return { showSettings: false, reportSent: false, detailsSent: false, userPresent: false, errorId: 0 };
    };
  },

  onUserSuccess: function(u) {
    user = u;
    chrome.storage.sync.set({"user": u});
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

  handleSendReport: function(form) {
    this.setState({reportSent: true});
    $.ajax({
      url: errorReportUrl,
      type: 'post',
      contentType: "application/x-www-form-urlencoded",
      data: form.serialize()
    })
    .done(function(data) {
      console.log(data);
      this.setState({errorId: data});
    }.bind(this))
    .fail(function() {
      console.log("error report error");
    })
    .always(function() {
      console.log("ajax report send complete");
    });
  },

  handleSendDetails: function(form) {
    this.setState({detailsSent: true});
    var errorId = this.state.errorId;
      $.ajax({
        url: errorReportUrl + "/" + errorId,
        type: 'post',
        contentType: "application/x-www-form-urlencoded",
        data: form.serialize()
      })
      .done(function(data) {
        console.log(data);
      })
      .fail(function() {
        console.log("error details error");
      });
  },

  handleConnectionReport: function(form) {
    $.ajax({
      url: errorReportUrl,
      type: 'post',
      contentType: "application/x-www-form-urlencoded",
      data: form.serialize(),
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
    if(this.state.userPresent){
      var settingsButton = <SettingsButton clickSettings={this.handleClickSettings} />;
      var chatBody = <ChatBox socketAddress={socketAddress} messageUrl={messageUrl} user={user}/>;
    }
    else {
      var chatBody=<UserAuth loginUrl={loginUrl} registerUrl={registerUrl} onSuccess={this.onUserSuccess}/>;
    }

    if(this.state.showSettings) {
      var settingsView = <SettingsPanel clickLogout={this.handleClickLogout} clickView={this.handleClickView} sendReport={this.handleSendReport} reportSent={this.state.reportSent} sendDetails={this.handleSendDetails} detailsSent={this.state.detailsSent}/>;
    }

    return(
      <div className="App">
      {settingsButton}
      {chatBody}
      {settingsView}
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
  render: function() {
    return (
      <div className="settingsPanel">
        <div className="button" onClick={this.props.clickLogout}>Logout</div>
        {/* <div className="button" onClick={this.props.clickView}>Change View</div> */}
        <ReportError onSend={this.props.sendReport} reportSent={this.props.reportSent}/>
        { this.props.reportSent ? <ReportDetails onSend={this.props.sendDetails} detailsSent={this.props.detailsSent}/> : null }
      </div>
    );
  }
});

var ReportDetails = React.createClass({
  getInitialState: function() {
    return {detailsSent: false};
  },

  handleSend: function(e) {
    e.preventDefault();
    this.setState({detailsSent: true});
    var form = this.refs.detailsForm.getDOMNode();
    this.props.onSend($(form));
  },

  render: function() {
    if (this.state.detailsSent) {
      return (
        <div className="reportDetails" id="details_sent">Got it.</div>
        );
    } else {
      return (
        <form className="reportDetails" onSubmit={this.handleSend} ref="detailsForm">
          <div><textarea placeholder="Details?" name="description"></textarea></div>
          <input type="submit"/>
        </form>
        );
    };
  }
});

var ReportError = React.createClass({
  sendReport: function() {
    this.setState({reportSent: true});
    var container = this.getDOMNode();
    var form = $(container).find("form");
    console.log(form);
    this.props.onSend($(form));
  },

  getInitialState: function() {
    return ( {reportSent: this.props.reportSent} );
  },

  render: function() {
    return (
      <div className="reportError button">
        {this.props.reportSent ? <span id="report_sent">Report Sent</span>  : <span onClick={this.sendReport}>Report Page Error</span>}
        <form ref="errorForm">
          <input type="hidden" name="url" value={url}/>
          <input type="hidden" name="user_id" value={user["id"]}/>
          {/*{<input type="hidden" name="os" id="os"/>}*/}
        </form>
      </div>
    );
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
