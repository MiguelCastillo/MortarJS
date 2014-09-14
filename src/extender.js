define(["src/utils"], function(Utils) {
  "use strict";


  function Extender(/* extend* */) {
  }


  /**
   * Base dummy extension to use the prototype as a placeholder when establishing inheritance.
   * Override extension with any other base function that you wish all your prototypical
   * inheritance chains to use.
   */
  Extender.extension = function() {};


  /**
   * Figures out what the base is for inheritance and the items that are
   * extending the base 'class'
   */
  function getBase(target, sources) {
    if (target === Extender) {
      target = sources.shift();
      sources = sources;
    }

    return {
      target: target || {},
      sources: sources
    };
  }


  /**
   * Copies all properties into target
   */
  function copy(target, sources) {
    var i, length, source;

    // Allow n params to be passed in to extend this object
    for (i = 0, length = sources.length; i < length; i++) {
      source = clonePrototype(sources[i]);

      for (var property in source) {
        target[property] = source[property];
      }
    }

    return target;
  };


  /**
   * Deep copy of all properties into target
   */
  function copyDeep(target, sources) {
    var i, length, source;

    // Allow n params to be passed in to extend this object
    for (i = 0, length = sources.length; i < length; i++) {
      source = clonePrototype(sources[i]);

      for (var property in source) {
        if (Utils.isPlainObject(source[property])) {
          target[property] = copyDeep({}, [source[property]]);
        }
        else {
          target[property] = source[property];
        }
      }
    }

    return target;
  }


  function clonePrototype(target) {
    if (target && target.constructor === Function) {
      Extender.extension.prototype = target.prototype;
      return new Extender.extension();
    }

    return target;
  }


  function prototypeExtender(target) {
    if (target && target.constructor === Function) {
      target.prototype.extend = function() {return copy(target.prototype, Array.prototype.slice.call(arguments))};
      return target.prototype;
    }

    return target;
  }


  /**
   * Copies all the accessible properties from sources into target.  If target is a function,
   * then all properties are copied into the function's prototype.
   */
  function mixin(/*target, [sources]*/) {
    var base    = getBase(this, Array.prototype.slice.call(arguments)),
        target  = base.target,
        sources = base.sources,
        proto   = prototypeExtender(target);

    copy(proto, sources);
    target.extend = extend;
    return target;
  };


  /**
   * Interface to setup inheritance
   * Works similarly to Object.create, but this takes into account passing in constructors.
   */
  function extend(/*target, [sources]*/) {
    // Setup a function that we can instantiate and call the proper constructor
    function extension() {
      this.constructor.apply(this, arguments);
    }

    var base    = getBase(this, Array.prototype.slice.call(arguments)),
        target  = base.target,
        sources = base.sources,
        proto   = prototypeExtender(target);

    // Setup prototype chain and proper constructor
    Extender.extension.prototype = proto;
    extension.prototype = new Extender.extension();

    // Extend prototype to include the new functionality
    copy(extension.prototype, sources);
    extension.extend = extend;
    return extension;
  };


  Extender.copy = copy;
  Extender.copyDeep = copyDeep;
  Extender.mixin = mixin;
  Extender.extend = extend;
  return Extender;
});
