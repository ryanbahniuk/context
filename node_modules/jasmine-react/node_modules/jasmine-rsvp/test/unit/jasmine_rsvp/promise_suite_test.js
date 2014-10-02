define(function(require) {
  var JasmineRSVP = require('main');
  var RSVP = require('rsvp');

  describe('PromiseSuite', function() {
    this.promiseSuite = true;

    describe('#flush', function() {
      it('should work', function() {
        var x = RSVP.defer();
        var onResolve = jasmine.createSpy('onResolve');

        x.promise.then(onResolve);
        x.resolve();
        expect(onResolve).not.toHaveBeenCalled();

        this.flush();
        expect(onResolve).toHaveBeenCalled();
      });
    });
  });
});