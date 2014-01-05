/*
 * Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["mortar/model", "rivets"], factory);
  } else {
    // Browser globals
    this.mortar.rvmodel = factory(this.mortar.model, this.rivets);
  }
})
(function( model, rivets ) {
  "use strict";


  function binder() {
  }


  binder.prototype.bind = function( options ) {
    options = options || {};
    if ( options instanceof jQuery ) {
      options = {
        $el: options
      };
    }

    options.$el = options.$el || $(document);
    rivets.bind(options.$el, this.data);
  }


  binder.prototype.unbind = function( ) {
  }


  return model.extend(binder);
});
