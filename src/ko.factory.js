/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["ko"], factory);
  } else {
    // Browser globals
    this.mortar.koFactory = factory(this.ko);
  }
})
(function( ko ) {
  "use strict";


  function factory() {
  }


  factory.primitiveTypes = {
    "undefined": true,
    "boolean": true,
    "number": true,
    "string": true
  };


  factory.getType = function(data) {
    if (data instanceof Array) {
      return "array";
    }

    var typeOf = typeof data;
    if ( factory.primitiveTypes.hasOwnProperty(typeOf) ) {
      return "primitive";
    }
    else if (typeOf === "object") {
      return "object";
    }

    throw "Invalid data type";
  };


  factory.array = function (data, target, settings) {
    var i = 0,
        length = data.length,
        type = false,
        update = ko.isObservable(target);

    settings = settings || {};

    if ( length ) {
      // We only need to get the type once; items in an
      // arrays are of the same data type.
      type = factory.getType(data[0]);
    }

    for ( ; i < length; i++ ) {
      data[i] = factory[type](data[i], target, settings);
    }

    if ( update === true ) {
      target(data);
      return target;
    }

    return ko.observableArray(data);
  };


  factory.primitive = function(data, target, settings) {
    var update = ko.isObservable(target);
    if ( update === true ) {
      target(data);
      return target;
    }

    return ko.observable(data);
  };


  factory.object = function(data, target, settings) {
    var type, item, value, update = false;
    target = target || {};
    settings = settings || {};

    for ( var i in data ) {
      // If i isn't a property of data, then we will continue on to the next property
      if (data.hasOwnProperty(i) === false) {
        continue;
      }

      update = target.hasOwnProperty(i);
      item   = data[i];
      type   = factory.getType(item);
      value  = factory[type](item, target[i], settings[i]);

      if (update === false) {
        target[i] = value;
      }
    }

    return target;
  };


  /**
  * @param <Object> data - is the new data that will either generate a new view model
  *                 or will be merged into target.
  * @param <Object> target - optional object where data will be copied into.
  */
  factory.serialize = function(data, target, settings) {
    var type = factory.getType(data);
    return factory[type](data, target, settings);
  };


  factory.deserialize = function(data) {
    return ko.toJS(data);
  };


  factory.bind = function( data, $el ) {
    $($el).each(function(index, el) {
      ko.applyBindings(data, el);
    });
  };


  factory.unbind = function( $el ) {
    $($el).each(function(index, el) {
      ko.cleanNode(el);
    });
  };


  return factory;

});

