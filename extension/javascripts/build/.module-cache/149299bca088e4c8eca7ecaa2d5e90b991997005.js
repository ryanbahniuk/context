/** @jsx React.DOM */

var LoginForm = React.createClass({displayName: 'LoginForm',
  mixins: [React.addons.LinkedStateMixin],
  render: function() {
    return (
      React.DOM.form({className: "loginForm", onSubmit: this.handleLogin}, 
      React.DOM.p(null, this.state.errors), 
      React.DOM.input({type: "text", placeholder: "Email", ref: "userEmail"}), 
      React.DOM.input({type: "password", placeholder: "Password", ref: "userPassword"}), 
      React.DOM.input({type: "submit"})
      )
     );
  },

  handleLogin: function() {
    e.preventDefault();
    var userEmail = this.refs.userEmail.getDOMNode().value.trim();
    var userPassword = this.refs.userPassword.getDOMNode().value.trim();
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      success: function(data) {
        if(data["error"]) {
          this.setState({errors: data["error"]});
        } else if (data["user"]) {
          ChatBox.render();
        } else {


        }
      }
    })
  }
});

React.renderComponent(
  LoginForm(null),
  document.getElementById("content")
);