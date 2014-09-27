var Login = React.createClass({
  render: function() {
    return (
      <input type="text" defaultValue="Email"/>
     );
  }
});

React.renderComponent(
  <Login/>,
  document.getElementById("content")
  );