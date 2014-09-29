/** @jsx React.DOM */

// var httpServer = "http://104.131.117.55:3000/";
var httpServer = "http://localhost:3000/";
var loginUrl = httpServer + "login";
var registerUrl = httpServer + "users";
var messageUrl = httpServer + "urls/messages/10";
var errorReportUrl = httpServer + "error";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({

  getInitialState: function() {
    if(user !== undefined) {
      return { showSettings: false, reportSent: false, detailsSent: false, userPresent: true };
    } else {
      return { showSettings: false, reportSent: false, detailsSent: false, userPresent: false };
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
    // chrome.runtime.getPlatformInfo(function(obj){
    //   form.find("#os").val(obj.os);

      console.log(form.serialize());
      // console.log(obj.os);

      $.ajax({
        url: errorReportUrl,
        type: 'post',
        contentType: "application/x-www-form-urlencoded",
        data: form.serialize()
      })
      .done(function(data) {
        console.log("error report submitted");
        console.log(data);
      })
      .fail(function() {
        console.log("error report error");
      });
    // })
  },

  handleSendDetails: function() {
    this.setState({detailsSent: true});
  },

  render: function() {
    return(
      <div className="App">

      {this.state.userPresent ? <SettingsButton clickSettings={this.handleClickSettings}/> : null}

      {this.state.showSettings ? <SettingsPanel clickLogout={this.handleClickLogout} clickView={this.handleClickView} sendReport={this.handleSendReport} reportSent={this.state.reportSent} sendDetails={this.handleSendDetails} detailsSent={this.state.detailsSent}/> : null}

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
  render: function() {
    return (
      <div className="settingsPanel">
        <div className="button" onClick={this.props.clickLogout}>Logout</div>
        {/* <div className="button" onClick={this.props.clickView}>Change View</div> */}
        <ReportError onSend={this.props.sendReport} reportSent={this.props.reportSent}/>
        { this.props.reportSent ? <ReportDetails detailsSent={this.props.detailsSent}/> : null }
      </div>
    );
  }
});

var ReportError = React.createClass({
  sendReport: function() {
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
        {this.state.reportSent ? <span id="report_sent">Report Sent</span>  : <span onClick={this.sendReport}>Report Page Error</span>}
        <form ref="errorForm">
          <input type="hidden" name="url" value={url}/>
          <input type="hidden" name="user_id" value={user["id"]}/>
          {/*{<input type="hidden" name="os" id="os"/>}*/}
        </form>
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
    // MAKE AJAX REQUEST
  }, 

  render: function() {
    if (this.state.detailsSent) {
      return (
        <div className="reportDetails" id="details_sent">Got it.</div>
        );
    } else {
      return (
        <form className="reportDetails" onSubmit={this.handleSend}>
          <div><textarea placeholder="Details?"></textarea></div>
          <input type="submit"/>
        </form>
        );
    };
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