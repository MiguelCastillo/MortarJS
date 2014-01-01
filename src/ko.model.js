/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["mortar/model", "ko"], factory);
  } else {
    // Browser globals
    this.mortar.kobinder = factory(this.mortar.model, this.ko);
  }
})
(function( model, ko ) {
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

    // Make sure we use the document as the default recipient of the binding
    options.$el = options.$el || $(document);

    // Do the binding
    options.$el.each(function(el) {
      ko.applyBinding(this.data, el);
    });
  }


  binder.prototype.unbind = function( options ) {
    options = options || {};
    if ( options instanceof jQuery ) {
      options = {
        $el: options
      };
    }

    // If no el is provided, then
    options.$el = options.$el || $(this._els);

    options.$el.each(function(el) {
      ko.cleanNode(el);
    });
  }


  return model.extend(binder);
});
