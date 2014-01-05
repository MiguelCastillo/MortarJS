/*
 * Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    this.mortar = factory();
  }
})
(function() {
  "use strict";
  return {};
});
