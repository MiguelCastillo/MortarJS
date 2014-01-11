define([], function() {
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
        _.extend(this, new extender.extension());
      }
      else {
        _.extend(this, iextension);
      }
    }

    return this;
  };


  // Base dummy extension to use the prototype as a placeholder when
  // establishing inheritance.
  extender.extension = function() {};


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
  };


  // Works similar to Object.create, but this takes into account passing in
  // constructors.
  extender.extend = function() {
    var base;

    // extender.extend( base, (object || function) * )
    if ( this === extender ) {
      base = Array.prototype.slice.call(arguments).shift();
    }
    else {
      base = this;
    }

    // Setup extension class to be able to setup inheritance
    if ( base && base.constructor === Function ) {
      extender.extension.prototype = base.prototype;
    }
    else {
      extender.extension.prototype = base;
    }

    // Setup a function the we can instantiate and properly call the
    // proper constructor
    function extension() {
      this.constructor.apply(this, arguments);
    }

    extension.prototype = new extender.extension();
    extension.__super__ = base.prototype;
    extender.mixin.apply(base, [extension].concat.apply(extension, arguments));
    return extension;
  };


  return extender;
});

