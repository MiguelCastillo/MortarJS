/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(function(require, exports, module) {

  //
  // http://msdn.microsoft.com/en-us/library/ff921098(v=pandp.40).aspx
  //

  var _ready = $.Deferred();

  // When DOM is loaded attach the app
  $(_ready.resolve);

  _ready.done(function() {
    require("app/transitions/app");
  });

  return {
    promise: _ready.promise,
    ready: _ready.done
  };
});
