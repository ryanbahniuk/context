/** @jsx React.DOM */
var runFromLocal = false;
var socketAddress, httpServer;

if(runFromLocal) {
  socketAddress = "ws://localhost:8080/";
  httpServer = "http://localhost:3000/";
} else {
  socketAddress = 'ws://104.131.117.55:8080';
  httpServer = "http://104.131.117.55:3000/";
};

var loginUrl = httpServer + "login";
var registerUrl = httpServer + "users";
var messageUrl = httpServer + "urls/messages/10";
var errorReportUrl = httpServer + "error";

var version = "0.0.8";
var user;
var url;


var App = React.createClass({displayName: 'App',

  getInitialState: function() {
    if(user !== undefined) {
      return { showSettings: false, reportSent: false, detailsSent: false, userPresent: true, errorId: 0, pendingErrors: [], versionOkay: true };
    } else {
      return { showSettings: false, reportSent: false, detailsSent: false, userPresent: false, errorId: 0, pendingErrors: [], versionOkay: true };
    };
  },

  onUserSuccess: function(object) {
    user = {"cookie": object};
    chrome.storage.sync.set(user);
    this.setState({userPresent: true});
  },

  handleVersionError: function() {
    this.setState({versionOkay: false});
  },

  handleClickSettings: function() {
    if(this.state.showSettings === false) {
      this.setState({showSettings: true});
    } else {
      this.setState({showSettings: false});
    };
  },

  handleClickLogout: function() {
    chrome.storage.sync.set({"cookie": null});
    socket.close();
    user = undefined;
    this.setState({userPresent: false, showSettings: false });
  },

  handleSendReport: function(form) {
    this.setState({reportSent: true});
    console.log(form.serialize());
    $.ajax(errorReportUrl, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      data: form.serialize()
    })
    .done(function(data) {
      console.log(data);
      this.setState({errorId: data});
    }.bind(this))
    .fail(function() {
      console.log("error report error");
      // var errorUpdate = this.state.pendingErrors;
      // errorUpdate.push(form.serialize());
      // this.setState({pendingErrors: errorUpdate});
      this.storeError(form.serialize());
      // console.log(this.state.pendingErrors);
    }.bind(this));
  },

  handleSendDetails: function(form) {
    this.setState({detailsSent: true});
    var errorId = this.state.errorId;
    $.ajax({
      url: errorReportUrl + "/" + errorId,
      method: 'post',
      contentType: "application/x-www-form-urlencoded",
      data: form.serialize()
    })
    .done(function(data) {
      console.log(data);
    })
    .fail(function() {
      console.log("report saved");
      // var errorUpdate = this.state.pendingErrors;
      // errorUpdate.push(form.serialize());
      // this.setState({pendingErrors: errorUpdate});
      // console.log(this.state.pendingErrors);
      this.storeError(form.serialize());
    }.bind(this));
  },

  storeError: function(form) {
    chrome.storage.local.set({"error": form});
  },

  tryResendReports: function() {
    chrome.storage.local.get("error", function(obj) {
      if(obj["error"] != null) {
        $.ajax({
          url: errorReportUrl,
          method: 'post',
          contentType: "application/x-www-form-urlencoded",
          data: obj["error"],
        })
        .done(function() {
          chrome.storage.local.set({"error": null});
        }.bind(this));
      }
    });
  },

  componentWillUpdate: function() {
    url = document.URL.split("?")[1].replace(/url=/,"");
    console.log(url);
  },

  componentDidUpdate: function() {
    this.tryResendReports();
  },

  render: function() {
    var settingsButton = null;
    var body = null;
    var settingsView = null;

    if(this.state.versionOkay === false) {
      body = VersionError(null)
    }
    else if(this.state.userPresent){
      settingsButton = SettingsButton({clickSettings: this.handleClickSettings});
      body = ChatBox(null);
    }
    else {
      body = UserAuth({onSuccess: this.onUserSuccess, onConnectionReport: this.handleSendReport});
    };

    if(this.state.showSettings) {
      settingsView = SettingsPanel({clickLogout: this.handleClickLogout, clickView: this.handleClickView, sendReport: this.handleSendReport, reportSent: this.state.reportSent, sendDetails: this.handleSendDetails, detailsSent: this.state.detailsSent});
    };

    return(
      React.DOM.div({className: "App"}, 
      settingsButton, 
      body, 
      settingsView
      )
    );
  },

});

var VersionError = React.createClass({displayName: 'VersionError',
  render: function() {
    return ( React.DOM.p(null, " This is version ", version, " ") );
  }
});

var SettingsButton = React.createClass({displayName: 'SettingsButton',
  render: function() {
    return (
      React.DOM.i({className: "settingsButton fa fa-cog", onClick: this.props.clickSettings})
    );
  }
});

var SettingsPanel = React.createClass({displayName: 'SettingsPanel',
  render: function() {
    return (
      React.DOM.div({className: "settingsPanel"}, 
        React.DOM.div({className: "button", onClick: this.props.clickLogout}, "Logout"), 
        /* <div className="button" onClick={this.props.clickView}>Change View</div> */
        ReportError({onSend: this.props.sendReport, reportSent: this.props.reportSent}), 
         this.props.reportSent ? ReportDetails({onSend: this.props.sendDetails, detailsSent: this.props.detailsSent}) : null
      )
    );
  }
});

var ReportDetails = React.createClass({displayName: 'ReportDetails',
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
        React.DOM.div({className: "reportDetails", id: "details_sent"}, "Got it.")
        );
    } else {
      return (
        React.DOM.form({className: "reportDetails", onSubmit: this.handleSend, ref: "detailsForm"}, 
          React.DOM.div(null, React.DOM.textarea({placeholder: "Details?", name: "description"})), 
          React.DOM.input({type: "hidden", name: "url", value: url}), 
          React.DOM.input({type: "hidden", name: "version", value: version}), 
          React.DOM.input({type: "hidden", name: "user_id", value: user["cookie"]}), 
          React.DOM.input({type: "submit"})
        )
        );
    };
  }
});

var ReportError = React.createClass({displayName: 'ReportError',
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
      React.DOM.div({className: "reportError button"}, 
        this.props.reportSent ? React.DOM.span({id: "report_sent"}, "Report Sent")  : React.DOM.span({onClick: this.sendReport}, "Report Page Error"), 
        React.DOM.form({ref: "errorForm"}, 
          React.DOM.input({type: "hidden", name: "url", value: url}), 
          React.DOM.input({type: "hidden", name: "version", value: version}), 
          React.DOM.input({type: "hidden", name: "user_id", value: user["cookie"]})
          /*{<input type="hidden" name="os" id="os"/>}*/
        )
      )
    );
  }
});

var ConnectionStatus = React.createClass({displayName: 'ConnectionStatus',
  render: function() {
    return (
      React.DOM.div({id: "status"}, "Disconnected")
    );
  }
});

function run() {
  React.renderComponent(
    App(null),
    document.getElementById("content")
  );
};

chrome.storage.sync.get("cookie", function(obj){
  if (obj["cookie"] === null) {
    obj = undefined;
  };
  user = obj;
  run();
});
