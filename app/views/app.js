/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define([
  "mortar/view",
  "app/views/navbar"
], function(view, navbar) {


  function create() {
    var _view = this;
    this.navbar = new navbar($(".navbar", _view.$el));
  }


  // Routing system to switch between views
  return view.extend({
    path:"app/views/app",
    resources: {
      tmpl: "url!",
      style: "url!"
    },
    events: {
      "view:ready": create
    }
  });

});

