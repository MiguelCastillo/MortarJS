/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(["mortar"], function(Mortar) {

  // Create requirejs config to shim jasmine and define module names
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


  // Configure testsRequire where all the tests are going to get their resources from
  var testsRequire = requirejs.config({
    "paths": {
      "mortar": "src"
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
      testsRequire([
        "tests/specs/extender",
        "tests/specs/view",
        "tests/specs/tmpl",
        "tests/specs/model",
        "tests/specs/rv.model",
        "tests/specs/rv.view",
        "tests/specs/ko.model"
      ], jasmine.execute);
    });
  }


  return Mortar.view.extend({
    className: "tests",
    events: {
      "view:ready": create
    }
  });
});

