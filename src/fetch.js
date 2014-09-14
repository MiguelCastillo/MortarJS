define([
  "src/spromise"
], function(Promise) {
  "use strict";

  var cache = {};

  function Fetch( settings ) {
    return Fetch.load( settings );
  }


  Fetch.load = function ( settings ) {
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
      cache[settings.url] = Promise.thenable($.ajax($ajax));

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
  };


  Fetch.get = function( url ) {
    return cache[url];
  };


  Fetch.remove = function( url ) {
    if ( url in cache ) {
      delete cache[url];
    }
  };


  Fetch.clear = function() {
    for ( var i in cache ) {
      delete cache[i];
    }
  };


  return Fetch;
});

