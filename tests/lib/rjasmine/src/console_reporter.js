/**
 * Jasmine Console Reporter Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define([
  "src/timer"
], function(Timer) {
  "use strict";

  function console_reporter(options) {
    var timer = options.timer || new Timer(),
        status = "loaded";

    var passed = 0, failed = 0;
    this.started = false;
    this.finished = false;

    this.jasmineStarted = function() {
      this.started = true;
      status = 'started';
      timer.start();
    };

    var executionTime;

    this.jasmineDone = function() {
      this.finished = true;
      executionTime = timer.elapsed();
      status = 'done';
      console.log("Passed:", passed, "Failed:", failed);
      console.log("Execution time: ", executionTime, "secs");
    };

    this.status = function() {
      return status;
    };

    this.suiteStarted = function(result) {
      console.log(result.description);
    };

    this.suiteDone = function(result) {
    };

    this.specStarted = function(result) {
    };

    this.specDone = function(result) {
      var i, length, failure;
      if ( result.status === "failed" ) {
        var message = ["  " + result.fullName];

        for (i = 0, length = result.failedExpectations.length; i < length; i++) {
          failure = result.failedExpectations[i];
          if ( failure.message ) {
            message.push("    " + failure.message);
          }
        }

        console.log(message.join("\n") + "\n");
        failed++;
      }
      else {
        passed++;
      }
    };

    this.executionTime = function() {
      return executionTime;
    };
  }


  return console_reporter;
});

