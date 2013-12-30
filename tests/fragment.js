/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(function(require, exports, module) {

  var template = require("mortar/fragment");

  template({
    url: "tests/tmpl/simple.html"
  })
  .done(function(html) {
    console.log("simple", html);
  });

  template({
    url: "tests/tmpl/multiple.html"
  })
  .done(function(html) {
    console.log("multiple", html);
  });

  template({
    url: "tests/tmpl/deep.html"
  })
  .done(function(html) {
    console.log("deep", html);
  });

});

