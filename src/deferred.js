/**
 * scpromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * Simple Compliant Promise
 * https://github.com/MiguelCastillo/scpromise
 */


define([
  "src/promise"
], function(scpromise) {
  "use strict";

  function deferred() {
    var promise = scpromise();
    return {
      promise: promise,
      resolve: promise.resolve,
      reject: promise.reject
    };
  }

  return deferred;

});

