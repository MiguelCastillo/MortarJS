/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(["mortar"], function(Mortar) {

  //
  // Create requirejs config to shim jasmine and define module names
  //
  var jasmineRequire = requirejs.config({
    "paths": {
      "mortar": "src",
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

      // Instantiate rjasmine and override the getContainer function in the
      // reporter to customize where the test results go.
      var jasmine = new rjasmine({
        reporter: {
          getContainer: function() {
            return _self.$el[0];
          }
        }
      });

      // Update window's jasmine public api.  This will make jasmine's test api
      // created by rjasmine to be globally accessible.
      rjasmine.extend(window, jasmine._api);

      // Get tests...
      jasmineRequire([
        "tests/extender",
        "tests/view",
        "tests/tmpl",
        "tests/model",
        "tests/rv.model",
        "tests/rv.view",
        "tests/ko.model"
        //,"tests/regex"
      ], function() {

        // Iterate through each test and run it so that each test can register
        // its test specs
        $.each(Array.prototype.slice.call(arguments), function(i, test) {
          test();
        });

        // Run the tests
        jasmine.execute();
      });
    });
  }


  return Mortar.view.extend({
    className: "tests",
    events: {
      "view:ready": create
    }
  });
});
