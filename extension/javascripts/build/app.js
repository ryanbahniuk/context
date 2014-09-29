/** @jsx React.DOM */

var httpServer = "http://104.131.117.55:3000/";
// var httpServer = "http://localhost:3000/";
var loginUrl = httpServer + "login";
var registerUrl = httpServer + "users";
var messageUrl = httpServer + "urls/messages/10";
var errorReportUrl = httpServer + "error";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({displayName: 'App',

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
    debugger;
    // chrome.runtime.getPlatformInfo(function(obj){
    //   form.find("#os").val(obj.os);

      // console.log(obj.os);

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
      });
    // })
    debugger;
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

  render: function() {
    return(
      React.DOM.div({className: "App"}, 

      this.state.userPresent ? SettingsButton({clickSettings: this.handleClickSettings}) : null, 

      this.state.showSettings ? SettingsPanel({clickLogout: this.handleClickLogout, clickView: this.handleClickView, sendReport: this.handleSendReport, reportSent: this.state.reportSent, sendDetails: this.handleSendDetails, detailsSent: this.state.detailsSent}) : null, 

      this.state.userPresent ? ChatBox({socketAddress: socketAddress, messageUrl: messageUrl, user: user}) : UserAuth({loginUrl: loginUrl, registerUrl: registerUrl, onSuccess: this.onUserSuccess})
      )
    );
  },

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
          React.DOM.input({type: "hidden", name: "user_id", value: user["id"]})
          /*{<input type="hidden" name="os" id="os"/>}*/
        )
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
          React.DOM.input({type: "submit"})
        )
        );
    };
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

chrome.storage.sync.get("user", function(obj){
  user = obj["user"];
  run();
});