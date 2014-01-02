/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */

define( function( require, exports, module ) {
  "use strict";

  var mortar = require("mortar/namespace"),
      widget = require("mortar/widget");

  // Make sure we load up handlers needed for a view.
  require("mortar/template");
  require("mortar/model");
  require("mortar/style");


  function getName(name, delimeter) {
    var name = "" + name,
        delimeter = delimeter || ".";
    return name.split(delimeter).shift();
  }



  function register(name, path) {
    path = path || "./" + name;

    /**
    * @param {string} name - the name of the widget.  Must follow jquery ui naming conventions
    */
    function _view ( name, base, protoype ) {
      base = base || {options: {}};
      base.options = base.options || {};
      var type, url, _name = getName(name);


      // We will assume we are going to load a template unless it has been specifically
      // turned off.
      if ( base.options.template !== false && typeof base.options.template !== "string" ) {
        var template = base.options.template || {};
        type = template.type || "html";
        url = template.url || path + "/" + _name + "." + type;

        base.options.template = {
          type: type,
          url: url
        };
      }

      // We will also assume we are going to load a css unless specifically disabled.
      if ( base.options.style !== false && typeof base.options.template !== "string" ) {
        var style = base.options.style || {};
        type = style.type || "css";
        url  = style.url || path + "/" + _name + "." + type;

        base.options.style = {
          type: type,
          url: url
        };
      }

      widget( name, base, protoype );
    }

    return _view;
  }


  // Register default view and make the factory available in it so that
  // other views can be registered...
  var view = register("view");
  view.get = function( name, path ) {
    if ( !view[name] ) {
      view[name] = register(name, path);
    }

    return view[name];
  };

  $.view = view;
  mortar.view = view;
  return view;
});

