/**
 * rjasmine Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * https://github.com/MiguelCastillo/rjasmine
 */


define([
  "src/spromise"
], function(promise) {
  "use strict";

  var builtInReporters = {
    "console_reporter": true,
    "html_reporter": true
  };


  function reporters ( rjasmine, options ) {
    var _promises = [];

    for ( var option in options ) {
      var _reporter = options[option];

      // If its a built in reporter, we need to adjust the path
      // so that we can load the proper reporter
      if ( option in builtInReporters ) {
        option = "src/" + option;
      }

      _promises.push(load( rjasmine, option, _reporter ));
    }

    return promise.when.apply(promise, _promises);
  }


  function load( rjasmine, name, options ) {
    var _promise = new promise();

    require([name], function(reporter) {
      var _reporter = new reporter(rjasmine, options);
      rjasmine._env.addReporter(_reporter);
      _promise.resolve();
    });

    return _promise;
  }


  return reporters;

});

