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

  function fragment(settings) {
    settings = settings || {};
    var deferred = $.Deferred(),
        options = settings.options || settings;

    if (typeof options === "string") {
      deferred.resolve(options);
    }
    else if (typeof options.url === "string") {
      infuser.get({
          "templateId": options.url,
          "templateSuffix": "",
          "ajax": {
          }
        }, function( rc_fragment ) {
          deferred.resolve(rc_fragment);
        });
    }
    else if (options.html) {
      deferred.resolve(options.html);
    }
    else {
      deferred.reject("No suitable option");
    }

    return deferred;
  }


  widget("mortar.fragment", {
    options: {
    },

    _create: function() {
      var _fragment = new fragment(this);
      this.element.data("fragment", _fragment);
      this.fragment = _fragment;
    },

    _destroy: function() {

    }
  });

  mortar.fragment = fragment;
  return fragment;
});
