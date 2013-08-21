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

  var mortar  = require("mortar/namespace"),
      widget  = require("mortar/widget"),
      infuser = require("infuser"),
      ko      = require("ko");

  function model(options) {
    var deferred = $.Deferred();
    options = options || {};

    if ( typeof options.url === "string" ) {
      infuser.get({
          "templateId": options.url,
          "templateSuffix": "",
          "ajax": {
            dataType: "json"
          },
        }, function( rc_model ) {
          deferred.resolve( rc_model );
        });
    }
    else if ( typeof options.data === "object" ) {
      deferred.resolve(options.data);
    }
    else if ( typeof options === "object" ) {
      deferred.resolve(options);
    }
    else {
      deferred.reject("No suitable option");
    }

    return deferred;
  }


  widget("mortar.model", {
    options: {
    },

    _create: function() {
      var _self = this;
      var _model = new model(this.options);
      this.element.data("model", _model);
      this.model = _model;

      _model.done(function(data) {
        ko.applyBindings(data, _self.element[0]);
      });
    },

    _destroy: function() {

    }
  });


  mortar.model = model;
  return model;

});
