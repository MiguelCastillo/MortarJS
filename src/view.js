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

define( function( require, exports, module ) {
  "use strict";

  var mortar = require("mortar/namespace"),
      widget = require("mortar/widget");

  // Make sure we load up handlers needed for a view.
  require("mortar/fragment");
  require("mortar/model");
  require("mortar/style");

  /**
  * @param {string} name - the name of the widget.  Must follow jquery ui naming conventions
  */
  function view( name, base, protoype ) {
    base = base || {options: {}};
<<<<<<< HEAD

    var offset = name.length;
    while( offset ) {
      if (name[offset] === ".") {
        offset++;
=======
    var path = "./views", type, url, _name = "" + name;

    var offset = name.length;
    while( offset ) {
      if (_name[offset] === ".") {
        // Move the offset forward to exclude the period from the widget name.
        _name = _name.substr( offset + 1 );
>>>>>>> gh-pages
        break;
      }
      offset--;
    }

    // We will assume we are going to load a fragment unless it has been specifically
    // turned off.
<<<<<<< HEAD
    if ( !base.options.hasOwnProperty("fragment") || base.options.fragment === true ) {
      base.options.fragment = {
        url: "./views/" + name.substr( offset ) + ".html"
      };
    }

    if ( base.options.hasOwnProperty("style")  && base.options.style !== false ) {
      var type = base.options.style.type || "css";
      var url  = base.options.style.url || "./views/" + name.substr( offset ) + "." + type;
=======
    if ( base.options.fragment !== false ) {
      var fragment = base.options.fragment || {};
      type = fragment.type || "html";
      url = path + "/" + _name + "." + type;

      base.options.fragment = {
        type: type,
        url: url
      };
    }

    // We will also assume we are going to load a css unless specifically disabled.
    if ( base.options.style !== false ) {
      var style = base.options.style || {};
      type = style.type || "css";
      url  = style.url || path + "/" + _name + "." + type;
>>>>>>> gh-pages

      base.options.style = {
        type: type,
        url: url
      };
    }

    widget( name, base, protoype );
  }


  $.view = view;
  mortar.view = view;
  return view;
});

