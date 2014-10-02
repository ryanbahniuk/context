/* global requirejs: false, jasmine: false */
requirejs.config({
  baseUrl: '../lib',

  map: {
    '*': {
      'test': '../../test',
      'main': 'jasmine_rsvp/main'
    }
  },

  paths: {
  },

  deps: [
  ],

  callback: function() {
    // Avoid infinite loop in the pretty printer when trying to print objects with
    // circular references.
    jasmine.MAX_PRETTY_PRINT_DEPTH = 3;
  }
});