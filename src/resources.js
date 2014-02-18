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


  resources.register = function(type, handler) {
    resources.handlers[type] = handler;
  };


  resources.fetch = function(resource, handler) {
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


  resources.load = function(items, fqn) {
    var resource, parts, config, directive, path, name;
    var result = {},
        pathParts = fqn ? fqn.split("/") : [];

    // Makes sure that we have a list of resources in a proper format
    items = resources.ensureResources(items);

    // Get the name from the fqn for resource name assignment
    name = pathParts.pop();

    // Skip intermmidiate directory because this is where I am expceting the
    // resources to be located at based on its handler name.  This is what
    // gives me the ability to match resource handlers to directories
    pathParts.pop();

    // Setup root directory
    path = pathParts.join("/");

    for ( var handler in items ) {
      resource = items[handler];

      if ( !resource && resource !== "" ) {
        result[handler] = false;
        continue;
      }

      // Handle items with directives
      if ( /\w+!.*/.test(handler) ) {
        parts             = handler.split("!");
        handler           = parts[0];
        directive         = parts[1];
        config            = {};
        config[directive] = resource || path + "/" + handler + "/" + name;
        resource          = config;
      }

      result[handler] = resources.fetch(resource, handler);
    }

    return result;
  };


  resources.ensureResources = function( items ) {
    var result = {}, i, length;

    if ( items instanceof Array ) {
      for ( i = 0, length = items.length; i < length; i++ ) {
        result[ items[i] ] = "";
      }
    }
    else if (items) {
      result = items;
    }
    else {
      result = {};
    }

    return result;
  };


  return resources;

});
