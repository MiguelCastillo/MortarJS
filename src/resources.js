define([
  "src/tmpl",
  "src/model",
  "src/style"
], function(tmpl, model, style) {
  "use strict";


  function resources (items, path) {
    return resources.load(items, path);
  }


  resources.handlers = {
    "tmpl": tmpl,
    "model": model,
    "style": style
  };


  resources.get = function(resource, handler) {
    if (!handler || !resources.handlers[handler]) {
      return;
    }

    // Check for any hints of file extension.  If one does not exist,
    // then infer it based on the handler.
    if ( resource.url && resource.url.lastIndexOf(".") === -1 ) {
      var ext = resources.handlers[handler].extension;
      resource.url += ext ? "." + ext : "";
    }

    return resources.handlers[handler](resource);
  };


  resources.load = function(items, path) {
    // wire up to requirejs
    var resource, parts, config, type, result = {};

    for ( var handler in items ) {
      resource = items[handler];

      // Handle items with directives
      if ( /\w+!.*/.test(handler) ) {
        parts        = handler.split("!");
        handler      = parts[0];
        type         = parts[1];
        config       = {};
        config[type] = resource || path;
        resource     = config;
      }

      result[handler] = resources.get(resource, handler);
    }

    return result;
  };


  return resources;

});
