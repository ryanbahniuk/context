describe("Timestamp", function() {
  it("can show a time", function() {
    var time = jasmineReact.renderComponent(<TimeStamp />);
    expect(time.props.time).toBe(1);
  });
});
