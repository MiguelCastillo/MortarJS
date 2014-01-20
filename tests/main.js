/*
 * MortarJs Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define(["mortar"], function(Mortar) {

  // Configure testsRequire where all the tests are going to get their resources from
  require.config({
    "paths": {
      "mortar": "src",
      "rjasmine": "tests/libs/js/rjasmine"
    }
  });


  function create() {
    var _self = this;

    // Get rjasmine
    require(["rjasmine"], function(rjasmine) {
      // Instantiate rjasmine and override the getContainer function in the
      // reporter to customize where the test results go.
      var _rjasmine = new rjasmine({
        reporters: {
          html_reporter: {
            getContainer: function() {
              return _self.$el[0];
            }
          }
        }
      });

      // Update window's jasmine public api.  This will make jasmine's test api
      // created by rjasmine to be globally accessible.
      rjasmine.extend(window, _rjasmine._api);
      window.jasmine = rjasmine.jasmine;

      _rjasmine.ready(function() {
        require([
          "tests/specs/promise",
          "tests/specs/extender",
          "tests/specs/view",
          "tests/specs/tmpl",
          "tests/specs/model",
          "tests/specs/rv.model",
          "tests/specs/rv.view",
          "tests/specs/ko.model"
        ], function() {
          _rjasmine.execute();
        });
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

