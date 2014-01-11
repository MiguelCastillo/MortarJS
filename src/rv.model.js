define([
  "mortar/model",
  "rivets"
], function( model, rivets ) {
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
  };


  binder.prototype.unbind = function( ) {
  };


  return model.extend(binder);
});
