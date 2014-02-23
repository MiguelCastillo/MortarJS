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
  "jasmine-html",
  "src/extender",
  "src/inBrowser"
], function(jasmineHtml, extender, inBrowser) {
  "use strict";


  function htmlReporter( rjasmine, options ) {

    var jasmine = rjasmine.jasmine,
        core    = rjasmine._core,
        env     = rjasmine._env;


    /**
     * ## Runner Parameters
     *
     * More browser specific code - wrap the query string in an object and to allow for getting/setting parameters from the runner user interface.
     */

    if ( inBrowser ) {
      /**
       * Since this is being run in a browser and the results should populate to an HTML page, require the HTML-specific Jasmine code, injecting the same reference.
       */
      jasmine.html(core);

      var queryString = new core.QueryString({
        getWindowLocation: function() { return window.location; }
      });

      var catchingExceptions = queryString.getParam("catch");
      env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

      /**
       * ## Reporters
       * The `HtmlReporter` builds all of the HTML UI for the runner page. This reporter paints the dots, stars, and x's for specs, as well as all spec names and all failures (if any).
       */
      var reporter = new core.HtmlReporter( extender({
        env: env,
        onRaiseExceptionsClick: function() { queryString.setParam("catch", !env.catchingExceptions()); },
        getContainer: function() { return document.body; },
        createElement: function() { return document.createElement.apply(document, arguments); },
        createTextNode: function() { return document.createTextNode.apply(document, arguments); },
        timer: new core.Timer()
      }, options) );

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

      reporter.initialize();
    }
  }

  return htmlReporter;
});

