/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["mortar/resource", "jquery"], factory);
  } else {
    // Browser globals
    factory(this.mortar.resource, this.$);
  }
})
(function(resource, $) {
  "use strict";

  function model(options) {
    var deferred = $.Deferred();
    options = options || {};

    if ( typeof options.url === "string" ) {
      resource({
        "url": options.url,
        "ajax": {
          dataType: "json"
        }
      }).done(deferred.resolve).fail(deferred.reject);
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

  return model;
});
