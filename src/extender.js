/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    this.mortar.extender = factory();
  }
})
(function() {
  "use strict";

  function extender(/* extend* */) {
    this.extend.apply(this, arguments);
  }


  extender.prototype.extend = function( /* extend+ */ ) {
    var extensions = Array.prototype.slice.call(arguments),
        iextension;

    // Allow n params to be passed in to extend this object
    while(extensions.length) {
      iextension = extensions.shift();

      if ( iextension.constructor === Function ) {
        function extension() {}
        extension.prototype = iextension.prototype;
        $.extend(this, new extension);
      }
      else {
        $.extend(this, iextension);
      }
    }

    return this;
  }


  extender.expand = function() {
    var _extender = new extender(),
        args = Array.prototype.slice.call(arguments),
        base = args.shift();

    if ( base.constructor === Function ) {
      _extender.extend.apply(base.prototype, args);
    }
    else {
      _extender.extend.apply(base, args);
    }

    base.prototype.extend = _extender.extend;
    base.extend = extender.extend;
    return base;
  }


  extender.extend = function( /* extend+ */ ) {
    // Setup base class to be able to setup inheritance below
    function extension() {}

    if ( this.constructor === Function ) {
      extension.prototype = this.prototype;
    }
    else {
      extension.prototype = this;
    }

    // Setup a function the we can instantiate and properly call the
    // proper constructor
    function base() {
      this.constructor.apply(this, arguments);
    }

    base.prototype = new extension;
    base.__super__ = this.prototype;
    extender.expand.apply(this, [base].concat.apply(base, arguments));
    return base;
  }


  return extender;
});

