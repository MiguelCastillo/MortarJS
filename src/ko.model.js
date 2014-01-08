define([
  "mortar/model",
  "mortar/ko.factory"
], function( model, factory ) {
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
    factory.bind(_self.data, options.$el);
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
    factory.unbind(options.$el);
  }


  return model.extend(binder);
});
