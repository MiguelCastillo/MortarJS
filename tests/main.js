/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(function(require, exports, module) {

  //
  // Create requirejs config to shim jasmine and define module names
  //
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
    jasmineRequire(["tests/rjasmine"], function(rjasmine) {
      var jasmine = new rjasmine({
        reporter: {
          getContainer: function() {
            return _self.$el[0];
          }
        }
      });

      // Update window's jasmine public api
      rjasmine.extend(window, jasmine._api);

      // Get tests...
      require([
        "tests/extender",
        "tests/view",
        "tests/fragment",
        "tests/model",
        "tests/rv.model",
        "tests/ko.model"
      ], function() {
        $.each(Array.prototype.slice.call(arguments), function(i, test) {
          test();
        });

        // Run the tests
        jasmine.execute();
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
