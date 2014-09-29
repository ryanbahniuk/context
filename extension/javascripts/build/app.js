/** @jsx React.DOM */

var httpServer = "http://104.131.117.55:3000/";
var loginUrl = httpServer + "login";
var registerUrl = httpServer + "users";
var messageUrl = httpServer + "urls/messages/10";
var errorReportUrl = httpServer + "error/";
var socketAddress = 'ws://104.131.117.55:8080';

var App = React.createClass({displayName: 'App',

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

  handleSendReport: function() {
    this.setState({reportSent: true});
  },

  handleSendDetails: function() {
    this.setState({detailsSent: true});
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
         this.props.reportSent ? ReportDetails({detailsSent: this.props.detailsSent}) : null
      )
    );
  }
});

var ReportError = React.createClass({displayName: 'ReportError',
  sendReport: function() {
    $.ajax({
      url: errorReportUrl + url,
      type: 'post',
      dataType: 'text'
    })
    .done(function() {
      console.log("report sent");
    }.bind(this))
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      // move after adding route
      this.props.onSend();
      this.setState({reportSent: true});
      //
      console.log(errorReportUrl + url);
    }.bind(this)); 
  },

  getInitialState: function() {
    return ( {reportSent: this.props.reportSent} );
  },

  render: function() {
    return (
      React.DOM.div({className: "reportError button"}, 
        this.state.reportSent ? React.DOM.span({id: "report_sent"}, "Report Sent")  : React.DOM.span({onClick: this.sendReport}, "Report Page Error")
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
    // MAKE AJAX REQUEST
  }, 

  render: function() {
    if (this.state.detailsSent) {
      return (
        React.DOM.div({className: "reportDetails", id: "details_sent"}, "Got it.")
        );
    } else {
      return (
        React.DOM.form({className: "reportDetails", onSubmit: this.handleSend}, 
          React.DOM.div(null, React.DOM.textarea({placeholder: "Details?"})), 
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