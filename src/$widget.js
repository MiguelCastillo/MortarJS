/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(function(require, exports, module) {
  "use strict";

  require("jquery.widget");

  var mortar  = require("mortar/namespace"),
      ko      = require("ko"),
      $widget = $.widget;

  function widget( name, base, prototype ) {
    base = base || {};

    var _init    = base._init;
    var _create  = base._create;
    var _destroy = base._destroy;


    if (typeof _init === "function") {
      base._init = function() {
        _init.apply(this, arguments);
      };
    }

    if (typeof _create === "function") {
      base._create = function() {
        var _self = this, args = arguments;
        $.when(handleOptions.apply(_self, [_self.options])).always(function() {
          _create.apply(_self, args);
        });
      };
    }

    if (typeof _destroy === "function") {
      base._destroy = function() {
        if (this.hasOwnProperty("style")) {
          this.element.removeClass(this.widgetName);
        }

        _destroy.apply(this, arguments);
      };
    }

    $widget(name, base, prototype);
  }


  function handleOptions(options) {
    var _self = this;
    var resources = [null, null, null];

    if ( infuser ) {
      if ( options.template && mortar.template ) {
        options.template.element = options.template.element || _self.element;
        resources[0] = mortar.template(options.template);
      }

      if ( options.style && mortar.style ) {
        options.style.element = options.style.element || _self.element;
        resources[1] = mortar.style(options.style);
      }

      if ( options.model && mortar.model ) {
        options.model.element = options.model.element || _self.element;
        resources[2] = mortar.model(options.model);
      }
    }

    return $.when.apply($, resources).then(function(template, style, model) {
      if ( template ) {
        _self.template = template;
        _self.element.html( $(template) );
      }

      if ( style !== null ) {
        _self.style = style;
        _self.element.addClass(_self.widgetName);
      }

      if ( model ) {
        _self.model = model;
        _self.element.each(function(index, el) {
          ko.applyBindings(model, el);
        });
      }

      return {
        template: template,
        style: style,
        model: model
      };
    });
  }


  // Restore all jQuery widget factory functions and properties
  $.extend( widget, $widget );

  $.widget = widget;
  mortar.widget = widget;
  return mortar.widget;
});
