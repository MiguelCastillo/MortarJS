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
        extender.extension.prototype = iextension.prototype;
        _.extend(this, new extender.extension);
      }
      else {
        _.extend(this, iextension);
      }
    }

    return this;
  }


  // Base dummy extension to use the prototype as a placeholder when
  // establishing inheritance.
  extender.extension = function() {}


  extender.mixin = function() {
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


  // Works similar to Object.create, but this takes into account passing in
  // constructors.
  extender.extend = function() {
    var obj;

    // extender.extend( obj || function, (obj || function) * )
    if ( this === extender ) {
      obj = Array.prototype.slice.call(arguments).shift();
    }
    else {
      obj = this;
    }

    // Setup extension class to be able to setup inheritance
    if ( obj && obj.constructor === Function ) {
      extender.extension.prototype = obj.prototype;
    }
    else {
      extender.extension.prototype = obj;
    }

    // Setup a function the we can instantiate and properly call the
    // proper constructor
    function base() {
      this.constructor.apply(this, arguments);
    }

    base.prototype = new extender.extension;
    base.__super__ = obj.prototype;
    extender.mixin.apply(obj, [base].concat.apply(base, arguments));
    return base;
  }


  return extender;
});

