/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(function(require, exports, modules) {

  var view   = require("mortar/view"),
      router = require("mortar/hash.route");


  function create() {
    var _view = this;
    router(":name/**").on("change", function(evt, name) {
      $(".active", _view.$el).removeClass("active");
      $("[href=#" + name + "]", _view.$el).closest("li").addClass("active");
    });
  }


  return view.extend({
    path: "app/views/navbar",
    resources: {
      tmpl: "url!"
    },
    events: {
      "view:ready": create
    }
  });

});
