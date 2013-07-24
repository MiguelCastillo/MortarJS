/*
 * Copyright (c) 2013 Miguel Castillo.
 *
 * Licensed under MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

define(function(require, exports, module) {
  "use strict";

  var ko = require('ko');


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
  factory.fromJS = function(data, target, settings) {
    var type = factory.getType(data);
    return factory[type](data, target, settings);
  };


  factory.toJS = function(data) {
  };


  return factory;

});

