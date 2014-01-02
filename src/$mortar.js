/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(function(require, exports, module) {
  "use strict";

  var widget = require("mortar/widget").
        ko   = require("ko");


  /// Template
  var template = require("mortar/template");
  widget("mortar.template", {
    _create: function() {
      var _template = new template(this);
      this.element.data("template", _template);
      this.template = _template;
    }
  });


  /// Style
  var style = require("mortar/style");
  widget("mortar.style", {
    _create: function() {
      var _style = new style(this.options);
      this.element.data("style", _style);
      this.style = _style;
    }
  });


  /// Model
  var model = require("mortar/model");
  widget("mortar.model", {
    _create: function() {
      var _self = this;
      var _model = new model(this.options);
      this.element.data("model", _model);
      this.model = _model;

      _model.done(function(data) {
        ko.applyBindings(data, _self.element[0]);
      });
    }
  });

});
