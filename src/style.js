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
    if (typeof options.url === "string") {
      infuser.get({
          "templateId": options.url,
          "templateSuffix": "",
          "ajax": {
            dataType: "text"
          },
        }, function( rc_style ) {
          deferred.resolve( rc_style );
        });
    }
    else {
      deferred.reject("No suitable option"); 
    }

    return deferred;
  }


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
