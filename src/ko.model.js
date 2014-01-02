/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["mortar/model", "mortar/ko.factory", "ko"], factory);
  } else {
    // Browser globals
    this.mortar.kobinder = factory(this.mortar.model, this.mortar.koFactory, this.ko);
  }
})
(function( model, factory, ko ) {
  "use strict";


  function binder() {
  }


  binder.prototype.deserialize = function() {
    return factory.deserialize(this.data);
  }


  binder.prototype.bind = function( options ) {
    options = options || {};
    if ( options instanceof jQuery ) {
      options = {
        $el: options
      };
    }

    var _self = this;

    // Make sure we use the document as the default recipient of the binding
    options.$el = options.$el || $(document);

    if ( options.convert !== false && this.__koConverted !== true ) {
      this.__koConverted = true;
      this.data = factory.serialize(this.data);
    }

    // Do the binding
    options.$el.each(function(index, el) {
      ko.applyBindings(_self.data, el);
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
