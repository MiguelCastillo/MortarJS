/*
 * Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * https://github.com/MiguelCastillo/rjasmine
 *
 * jasmine boot expansion to provide AMD support
 */



/** Original note from jasmine boot.js */
/**
 Starting with version 2.0, this file "boots" Jasmine, performing all of the necessary initialization before executing the loaded environment and all of a project's specs. This file should be loaded after `jasmine.js`, but before any project source files or spec files are loaded. Thus this file can also be used to customize Jasmine for a project.

 If a project is using Jasmine via the standalone distribution, this file can be customized directly. If a project is using Jasmine via the [Ruby gem][jasmine-gem], this file can be copied into the support directory via `jasmine copy_boot_js`. Other environments (e.g., Python) will have different mechanisms.

 The location of `boot.js` can be specified and/or overridden in `jasmine.yml`.

 [jasmine-gem]: http://github.com/pivotal/jasmine-gem
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jasmine", "jasmine-html"], factory);
  }
  else {
    var rjasmine = factory(this.jasmineRequire),
        _rjasmine = new rjasmine();

    /**
     * Add all of the Jasmine global/public interface to the proper global, so a project can use the public interface directly. For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
     */
    rjasmine.extend(this, _rjasmine._api);

    /**
     * ## Execution
     *
     * Replace the browser window's `onload`, ensure it's called, and then run all of the loaded specs. This includes initializing the `HtmlReporter` instance and then executing the loaded Jasmine environment. All of this will happen after all of the specs are loaded.
     */
    var currentWindowOnload = this.onload;

    this.onload = function() {
      if (currentWindowOnload) {
        currentWindowOnload();
      }
      _rjasmine.execute();
    };
  }

}) (function(jasmine) {

  /**
   * Setting up timing functions to be able to be overridden. Certain browsers (Safari, IE 8, phantomjs) require this hack.
   */
  window.setTimeout = window.setTimeout;
  window.setInterval = window.setInterval;
  window.clearTimeout = window.clearTimeout;
  window.clearInterval = window.clearInterval;


  /**
   * Simple extend interface to copy properties from multiple sources into a single target output
   */
  function extend(/*target, source*/) {
    var sources = Array.prototype.slice.call(arguments),
        target  = sources.shift();

    for ( var source in sources ) {
      source = sources[source];

      // Copy properties
      for (var property in source) {
        target[property] = source[property];
      }
    }

    return target;
  }


  function rjasmine( options ) {
    options = options || {};

    /**
     * ## Require &amp; Instantiate
     *
     * Require Jasmine's core files. Specifically, this requires and attaches all of Jasmine's code to the `jasmine` reference.
     */
    var core = jasmine.core(jasmine);

    /**
     * Since this is being run in a browser and the results should populate to an HTML page, require the HTML-specific Jasmine code, injecting the same reference.
     */
    jasmine.html(core);

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
        return env.it(desc, func);
      },

      xit: function(desc, func) {
        return env.xit(desc, func);
      },

      beforeEach: function(beforeEachFunction) {
        return env.beforeEach(beforeEachFunction);
      },

      afterEach: function(afterEachFunction) {
        return env.afterEach(afterEachFunction);
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
        timer: new core.Timer()
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
     * ## Runner Parameters
     *
     * More browser specific code - wrap the query string in an object and to allow for getting/setting parameters from the runner user interface.
     */

    var queryString = new core.QueryString({
      getWindowLocation: function() { return window.location; }
    });

    var catchingExceptions = queryString.getParam("catch");
    env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

    /**
     * ## Reporters
     * The `HtmlReporter` builds all of the HTML UI for the runner page. This reporter paints the dots, stars, and x's for specs, as well as all spec names and all failures (if any).
     */
    var reporter = new core.HtmlReporter( extend({
      env: env,
      onRaiseExceptionsClick: function() { queryString.setParam("catch", !env.catchingExceptions()); },
      getContainer: function() { return document.body; },
      createElement: function() { return document.createElement.apply(document, arguments); },
      createTextNode: function() { return document.createTextNode.apply(document, arguments); },
      timer: new core.Timer()
    }, options.reporter) );

    /**
     * The `jsApiReporter` also receives spec results, and is used by any environment that needs to extract the results  from JavaScript.
     */
    env.addReporter(api.jsApiReporter);
    env.addReporter(reporter);

    /**
     * Filter which specs will be run by matching the start of the full name against the `spec` query param.
     */
    var specFilter = new core.HtmlSpecFilter({
      filterString: function() { return queryString.getParam("spec"); }
    });

    env.specFilter = function(spec) {
      return specFilter.matches(spec.getFullName());
    };


    // Intialize the reporter to get things ready to just run the tests
    reporter.initialize();

    // Extend the instance to include important bits from jasmine
    rjasmine.extend(this, api, {
      _api: api,
      _core: core,
      _env: env,
      _reporter: reporter,
      execute: env.execute,
      extend: extend
    });
  }

  // Easy access to extend.  Override if you want to customize extend
  rjasmine.extend = extend;
  return rjasmine;
});
