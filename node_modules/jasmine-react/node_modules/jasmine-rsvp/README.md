# jasmine-rsvp

Turn a Jasmine suite into one suitable for testing code that produces RSVP promises. The suite tests can be written in a synchronous style which is more readable and you get to control the promise queue.

Requires:

    - Jasmine 2.0+
    - RSVP

Example:

```javascript
define(function(require) {
  var RSVP = require('rsvp');

  describe('My component', function() {
    // Enable the jasmine-rsvp functionality for this suite:
    this.promiseSuite = true;

    it('should do something that takes a while', function() {
      var asyncService = RSVP.defer();
      var promise = asyncService.promise;
      var onDone = jasmine.createSpy();

      promise.then(onDone);

      // Notify that our service is finished:
      asyncService.resolve('yeah');

      // Flush the promise queue, run all promise callbacks:
      this.flush();

      expect(onDone).toHaveBeenCalled();
    });
  });
});
```

## Installation

The package is built as an AMD module `jasmine_rsvp` in 4 flavors:

  - `dist/jasmine-rsvp.min.js` production without RSVP; expects you have RSVP locally
  - `dist/jasmine-rsvp.js` development without RSVP
  - `dist/jasmine-rsvp-full.min.js` production with RSVP
  - `dist/jasmine-rsvp-full.js` development with RSVP

You can tell if the package was successfully installed by testing the `jasmine.RSVP` global:

```javascript
if (jasmine.RSVP && jasmine.RSVP.enabled) {
  // success
}
```

**Error logging**

The package will log all RSVP errors to the console by default. If you want to opt-out of that behavior, you can configure it:

```javascript
var jasmineRSVP = require('jasmine_rsvp');
jasmineRSVP.logRSVPErrors = false;

// or using the jasmine global:
jasmine.RSVP.logRSVPErrors = false;
```

## License

MIT