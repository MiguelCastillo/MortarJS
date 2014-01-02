/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define([
  "mortar/hash.route",
  "app/views/app"
], function(hash, app) {


  // If the url is empty, then we will redirect to "home"
  hash("").on("change", function(evt) {
    hash.navigate("home");
  });


  function create() {
    var _self = this;

    // Add app to the dom
    $("body").append(this.$el);

    hash(":name/**").on("change", function(evt, viewName) {
      require([viewName], function(view) {
        _self.transition(new view(), ".content");
      });
    });
  }


  // Create app...
  var _app = new app({
    // Map events
    events: {
      "view:ready": create
    }
  });

});

