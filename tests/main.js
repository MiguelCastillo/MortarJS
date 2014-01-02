/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(function(require, exports, module) {

  var jasmineRequire = requirejs.config({
    "paths": {
      "jasmine": "lib/jasmine-2.0.0/jasmine",
      "jasmine-html": "lib/jasmine-2.0.0/jasmine-html"
    },
    "shim": {
      "jasmine": {
        "exports": "jasmineRequire"
      },
      "jasmine-html": ["jasmine"]
    }
  });


  function create() {
    var _self = this;

    // Get rjasmine
    jasmineRequire(["tests/rjasmine"], function(jasmine) {
      // Get tests...
      require([
        "tests/extender",
        "tests/view",
        "tests/fragment",
        "tests/model",
        "tests/rv.model",
        "tests/ko.model"
      ], function() {
        jasmine.htmlReporter.initialize();
        jasmine.env.execute();
      });
    });
  }


  return require("mortar/view").extend({
    className: "tests",
    events: {
      "view:ready": create
    }
  });
});
