/**
 * rjasmine Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * https://github.com/MiguelCastillo/rjasmine
 *
 * jasmine boot expansion to provide AMD support. With the exception of a
 * few additions/adjustments, most of the code is straight from jasmine boot
 */


define([
  "jasmine",
  "src/spromise",
  "src/timer"
], function(jasmine, promise, timer) {
  "use strict";


  function boot( options ) {

    // Simple wrapper to make jasmine's done interface be used as promises
    function makePromise(func) {
      return function(done) {
        promise.when(func()).done(done);
      };
    }


    /**
     * ## Require &amp; Instantiate
     *
     * Require Jasmine's core files. Specifically, this requires and attaches all of Jasmine's code to the `jasmine` reference.
     */
    var core = jasmine.core(jasmine);

    /**
     * Create the Jasmine environment. This is used to run all specs in a project.
     */
    var env = core.getEnv();

    /**
     * ## The Global Interface
     *
     * Build up the functions that will be exposed as the Jasmine public interface. A project can customize, rename or alias any of these functions as desired, provided the implementation remains unchanged.
     */
    var api = {
      describe: function(description, specDefinitions) {
        return env.describe(description, specDefinitions);
      },

      xdescribe: function(description, specDefinitions) {
        return env.xdescribe(description, specDefinitions);
      },

      it: function(desc, func) {
        return env.it(desc, makePromise(func));
      },

      xit: function(desc, func) {
        return env.xit(desc, func);
      },

      beforeEach: function(beforeEachFunction) {
        return env.beforeEach(makePromise(beforeEachFunction));
      },

      afterEach: function(afterEachFunction) {
        return env.afterEach(makePromise(afterEachFunction));
      },

      expect: function(actual) {
        return env.expect(actual);
      },

      pending: function() {
        return env.pending();
      },

      spyOn: function(obj, methodName) {
        return env.spyOn(obj, methodName);
      },

      jsApiReporter: new core.JsApiReporter({
        timer: new timer()
      })
    };


    /**
     * Expose the interface for adding custom equality testers.
     */
    core.addCustomEqualityTester = function(tester) {
      env.addCustomEqualityTester(tester);
    };

    /**
     * Expose the interface for adding custom expectation matchers
     */
    core.addMatchers = function(matchers) {
      return env.addMatchers(matchers);
    };

    /**
     * Expose the mock interface for the JavaScript timeout functions
     */
    core.clock = function() {
      return env.clock;
    };

    /**
     * The `jsApiReporter` also receives spec results, and is used by any environment that needs to extract the results  from JavaScript.
     */
    env.addReporter(api.jsApiReporter);


    this.api = api;
    this.core = core;
    this.env = env;
  }


  return boot;
});

