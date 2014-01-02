/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(function(require, exports, module) {

  var view        = require("mortar/view");
  var components  = require("components/views/components");

  return function(options) {
    var _component = new components(options);
    return _component;
  }
});
