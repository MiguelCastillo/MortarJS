/**
 * rjasmine Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define(function() {
  "use strict";

  function extender(/*target, [source]+ */) {
    var sources = Array.prototype.slice.call(arguments),
        target  = sources.shift();

    for ( var source in sources ) {
      source = sources[source];

      // Copy properties
      for (var property in source) {
        target[property] = source[property];
      }
    }

    return target;
  }

  extender.mixin = extender;
  return extender;
});

