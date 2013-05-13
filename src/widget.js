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

  require("jquery.ui");
  var mortar = require("mortar/namespace");
  var _widget = $.widget;
  
  $.widget = function( name, base, prototype ) {
    base = base || {};

    var _create = base._create;
    var _destroy = base._destroy;

    if (typeof _create === 'function') {
      base._create = function() {
        var _self = this, args = arguments;
        $.when(handleOptions.apply(_self, [_self.options])).always(function() {
          _create.apply(_self, args);
        });
      };
    }

    if (typeof _destroy === 'function') {
      base._destroy = function() {
        _destroy.apply(this, arguments);
      };
    }

    _widget(name, base, prototype);
  };
  
  
  function handleOptions(options) {
    var _self = this;
    var resources = [null, null, null];    

    if ( infuser ) {
      if ( options.fragment && typeof options.fragment.url === "string" && mortar.fragment ) {
        resources[0] = mortar.fragment(options.fragment);
      }
  
      if ( options.style && typeof options.style.url === "string" && mortar.style ) {
        resources[1] = mortar.style(options.style);
      }
  
      if ( options.model && typeof options.model.url === "string" && mortar.model ) {
        resources[2] = mortar.model(options.model);
      }
    }

    return $.when.apply($, resources).then(function(fragment, style, model) {

      if ( typeof fragment === "string" ) {
        _self.element.html(fragment);
      }
      
      if ( typeof style === "string" ) {
      }
      
      if ( typeof model === "object" ) {
      }
      
      return {
        fragment: fragment,
        style: style,
        model: model        
      };
    });
  }

  // Restore all jQuery widget factory functions and properties
  $.extend( $.widget, _widget );

  mortar.widget = $.widget;
  return mortar.widget;
});
