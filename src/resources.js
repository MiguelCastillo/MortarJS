define([
  "src/extender"
], function(Extender) {
  "use strict";


  /**
  * Resources!  This will allow the registration of resources so that they can
  * be exposed to directory hierarchy expected for resources.
  * If a resouce handler is registered, then resources will automatically look
  * for resources in the directory matching the name of the resource type.  This
  * is how MortarJS can automatically load tmpl resources from the tmpl directory.
  */

  var loaders = {};


  function Resources (items, path) {
    return Resources.load(items, path);
  }


  Resources.register = function(type, loader) {
    if ( loader instanceof Resources.resource === false ) {
      throw new TypeError("Resource loader must be of type resource");
    }

    loaders[type] = loader;
  };


  Resources.fetch = function(resource, handler) {
    var resourceLoader = loaders[handler];

    // If the resource if a function, we will not handle process it as a resource
    if ( _.isFunction(resource) ) {
      return resource;
    }

    if (!handler || !resourceLoader) {
      return resource;
    }

    // Check for any hints of file extension.  If one does not exist, then infer it based on the handler.
    if ( resource.url && resource.url.lastIndexOf(".") === -1 ) {
      var ext = resourceLoader.extension;
      resource.url += ext ? "." + ext : "";
    }

    return resourceLoader.load(resource);
  };


  Resources.load = function(items, fqn) {
    var resource, parts, config, directive, path, name;
    var result = {},
        pathParts = fqn ? fqn.split("/") : [];

    // Makes sure that we have a list of resources in a proper format
    items = Resources.ensureResources(items);

    // Get the name from the fqn for resource name assignment
    name = pathParts.pop();

    // Skip intermmidiate directory because this is where I am expceting the resources to be located at based
    // on its handler name.  This is what gives me the ability to match resource loaders to directories
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

      resource.location = path + "/" + handler + "/" + name;
      result[handler] = Resources.fetch(resource, handler);
    }

    return result;
  };


  Resources.ensureResources = function( items ) {
    var result = {};
    var i, length;

    if ( items instanceof Array ) {
      for ( i = 0, length = items.length; i < length; i++ ) {
        result[ items[i] ] = "";
      }
    }
    else if (items) {
      result = items;
    }

    return result;
  };


  /**
  *  Resource interface to devire from when processing external resources
  */
  Resources.resource = function() {};
  Extender.mixin(Resources.resource, {
    load: $.noop
  });


  return Resources;
});
