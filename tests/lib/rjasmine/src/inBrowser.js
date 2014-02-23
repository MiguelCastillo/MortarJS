/**
 * rjasmine Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * https://github.com/MiguelCastillo/rjasmine
 */


define(function() {
  "use strict";

  /**
  * A way to verify if code is running in a window
  */
  var inBrowser = window && window.navigator && window.document;

  /**
   * From jasmine boot:
   * Setting up timing functions to be able to be overridden. Certain browsers (Safari, IE 8, phantomjs) require this hack.
   */
  if ( inBrowser ) {
    window.setTimeout = window.setTimeout;
    window.setInterval = window.setInterval;
    window.clearTimeout = window.clearTimeout;
    window.clearInterval = window.clearInterval;
  }

  return inBrowser;

});
