/** @jsx React.DOM */

describe("App", function() {
  var app;
  var test;
  var el = document.getElementById("body")

  describe("getInitialState", function() {
    beforeEach(function() {
      app = new App();
    });

    it("should provide initial state of user present false if no user", function() {
      // jasmineReact.spyOnClass(App, "getInitialState").andReturn("test");
      // var text = jasmineReact.renderComponent(<App />);
      // expect(text).toBe("test");
      var initialState = App.getInitialState();
      expect(initialState["userPresent"]).toEqual(false);
    });
  })
});
