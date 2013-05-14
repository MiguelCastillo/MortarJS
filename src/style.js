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

  var mortar = require("mortar/namespace"),
      widget = require("mortar/widget"),
      infuser = require("infuser");

  function style(options) {
    var deferred = $.Deferred();
    options = options || {};

    if (typeof options.css === "string" ) {
    }
    else if (typeof options.less === "string" ) {
    }
    else if (typeof options.url === "string") {
      var handler = styleHandler[options.type];
      if (handler) {
        handler.load(options, deferred); 
      }
    }
    else {
      deferred.reject("No suitable option"); 
    }

    return deferred;
  }
  

  function loader(url, dataType, cb) {
    infuser.get({
      "templateId": url,
      "templateSuffix": "",
      "ajax": {
        dataType: dataType
      },
    }, cb);
  }


  var styleHandler = {
    "css": {
      dataType: "text",
      load: function(options, deferred){
        loader(options.url, "text", function(rc_style){
          $("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
          deferred.resolve( rc_style );          
        });
        
        /*
        * Loading directly as a link...  Not really what we need from this
        var cssLink = document.createElement("link");
        cssLink.setAttribute("rel", "stylesheet");
        cssLink.setAttribute("type", "text/css");
        cssLink.setAttribute("href", options.url);
        deferred.resolve(cssLink);
        */
      }
    },
    "$css": {
      load: function(options, deferred) {
        loader(options.url, "json", function(rc_style){
          if( options.element instanceof jQuery ){
            options.element.css(rc_style);
          }
          deferred.resolve( rc_style );          
        });
      }
    },
    "less": {
      load: function(options, deferred) {
        loader(options.url, "text", function(rc_style){
          //Process less content and then add it to the document as regular css
          //$("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
          deferred.resolve( rc_style );
        });
      }
    }
  };


  widget("mortar.style", {
    options: {

    },

    _create: function() {
        
    },

    _destroy: function() {
        
    }
  });

  mortar.style = style;
  return style;
});
