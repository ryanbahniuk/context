var grunt = require('grunt');
var _ = require('lodash');
var extend = _.extend;

var baseOptions = {
  baseUrl: './lib',
  mainConfigFile: '.requirejs',

  removeCombined:           false,
  inlineText:               true,
  preserveLicenseComments:  false,

  uglify2: {
    warnings: true,
    mangle:   true,

    output: {
      beautify: false
    },

    compress: {
      sequences:  true,
      dead_code:  true,
      loops:      true,
      unused:     true,
      if_return:  true,
      join_vars:  true
    }
  },

  pragmas: {
    production: true
  },

  rawText: {
    'jasmine_rsvp': 'define(["jasmine_rsvp/main"], function(jasmineRSVP) { return jasmineRSVP; });'
  },

  name: 'jasmine_rsvp',
  deps: [ 'jasmine_rsvp/main' ]
};

module.exports = {
  // Minified build, does not include RSVP, only Backburner:
  production: {
    options: extend({}, baseOptions, {
      out: "dist/<%= grunt.config.get('pkg.name') %>.min.js",
      optimize: 'uglify2',
      paths: {
        'rsvp': 'empty:'
      },
    })
  },

  // Minified build with RSVP and Backburner:
  production_with_rsvp: {
    options: extend({}, baseOptions, {
      out: "dist/<%= grunt.config.get('pkg.name') %>-full.min.js",
    })
  },

  // Raw build without RSVP, only Backburner:
  development: {
    options: extend({}, baseOptions, {
      out: "dist/<%= grunt.config.get('pkg.name') %>.js",
      optimize: 'none',
      paths: {
        'rsvp': 'empty:'
      },
    })
  },

  // Raw build with Backburner and RSVP:
  development_with_rsvp: {
    options: extend({}, baseOptions, {
      out: "dist/<%= grunt.config.get('pkg.name') %>-full.js",
      optimize: 'none',
    })
  }
};