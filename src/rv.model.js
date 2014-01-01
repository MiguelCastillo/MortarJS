/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["rivets"], factory);
  } else {
    // Browser globals
    this.mortar.rvbinder = factory(this.rivets);
  }
})
(function( rivets ) {
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
    rivets.bind(options.$el, this._data);
  }


  binder.prototype.unbind = function( ) {
  }


  return binder;

});
