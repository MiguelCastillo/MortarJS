/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define([
  "src/promise"
], function(promise) {
  "use strict";

  function deferred() {
    var promise1 = promise();
    return {
      promise: promise1,
      resolve: promise1.resolve,
      reject: promise1.reject
    };
  }

  return deferred;

});

