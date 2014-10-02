/* global jasmine: false */
define(function(require) {
  var RSVP = require('rsvp');
  var Polyfills = require('./phantomjs_polyfills');
  var PromiseSuite = require('./promise_suite');
  var jasmineSuite = jasmine.Suite;

  var config = jasmine.RSVP = {
    enabled: true,
    logRSVPErrors: true
  };

  RSVP.configure('onerror', function(e) {
    if (!config.logRSVPErrors) {
      return;
    }

    console.error('RSVP error:', e);

    if (e && e.message) {
      console.error(e.message);
    }
    if (e && e.stack) {
      console.error(e.stack);
    }
  });


  Object.defineProperty(jasmineSuite.prototype, 'promiseSuite', {
    set: function() {
      PromiseSuite.call(this);
    }
  });

  return config;
});