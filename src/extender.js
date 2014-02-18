define(function() {
  "use strict";


  function extender(/* extend* */) {
    this.extend.apply(this, arguments);
  }


  /**
  * Interface that iterates through all the input properties and prototype objects
  * to extend the instance of extender.
  */
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


  /**
  * Base dummy extension to use the prototype as a placeholder when establishing inheritance.
  * Override extension with any other base function that you wish all your prototypical
  * inheritance chains to use.
  */
  extender.extension = function() {};


  /**
  * Interface to setup extending capabilties.  Unlike extend, this will not create
  * a prototypical inheritance chain.
  */
  extender.mixin  = function() {
    var _extender = new extender(),
        args      = Array.prototype.slice.call(arguments),
        base      = args.shift();

    if ( base.constructor === Function ) {
      _extender.extend.apply(base.prototype, args);
      base.prototype.extend = _extender.extend;
    }
    else {
      _extender.extend.apply(base, args);
    }

    base.extend = extender.extend;
    return base;
  };


  /**
  * Interface to setup inheritance
  * Works similar to Object.create, but this takes into account passing in constructors.
  *
  * extender.extend( base, (object || function) * )
  */
  extender.extend = function() {
    var base = this === extender ? arguments[0] : this;

    // Setup extension class to be able to setup inheritance
    if ( base && base.constructor === Function ) {
      extender.extension.prototype = base.prototype;
    }
    else {
      extender.extension.prototype = base;
    }

    // Setup a function the we can instantiate and properly call the proper constructor
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

