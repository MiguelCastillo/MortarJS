/**
 * scpromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define([
  "src/promise",
  "src/when",
  "src/deferred"
], function(promise, when, deferred) {
  promise.when = when;
  promise.deferred = deferred;
  return promise;
});

