define([], function() {
  "use strict";

  var cache = {};

  function fetch( settings ) {
    if ( !settings ) {
      throw "Invalid settings";
    }

    if ( typeof settings === "string" ) {
      settings = {
        url: settings
      };
    }

    // If the item is cached, we will just return that.
    if ( settings.url in cache === false || settings.refresh === true ) {
      var $ajax = _.extend({
        url: settings.url,
        cache: false
      }, settings.ajax);

      // Make request and add to the cache.
      cache[settings.url] = $.ajax($ajax);

      // If cache is disabled, we delete the item from the cache once the
      // resource is downloaded.  The reason we put it in the cache hash
      // even when cache is disabled is to transparently avoid sending
      // multiple requests to the server for the same resource while the
      // same request is pending.
      if ( settings.cache === false ) {
        cache[settings.url].always(function() {
          delete cache[settings.url];
        });
      }
    }

    return cache[settings.url];
  }


  fetch.get = function( url ) {
    return cache[url];
  };


  fetch.remove = function( url ) {
    if ( url in cache ) {
      delete cache[url];
    }
  };


  fetch.clear = function() {
    for ( var i in cache ) {
      delete cache[i];
    }
  };


  return fetch;
});

