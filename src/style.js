/*
 * Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["mortar/fetch"], factory);
  } else {
    // Browser globals
    this.mortar.style = factory(this.mortar.fetch);
  }
})
(function( fetch ) {
  "use strict";


  function getType(name) {
    var offset = name.lastIndexOf(".");
    if ( offset !== -1 ) {
      return name.substr(offset + 1);
    }
  }


  function loader(url, dataType) {
    return fetch({
      "url": url,
      "ajax": {
        dataType: dataType
      }
    });
  }


  function style(options) {
    if (this instanceof style === false) {
      return new style(options);
    }

    var deferred = $.Deferred();
    options = options || {};

    if (typeof options.url === "string") {
      options.type = options.type || getType(options.url);
      var handler = style.handler[options.type];
      if (handler) {
        handler.load(options, deferred);
      }
    }
    else {
      deferred.reject("No suitable option");
    }

    return deferred;
  }


  style.handler = {
    "css": {
      dataType: "text",
      load: function(options, deferred){
        loader(options.url, "text").done(function(rc_style){
          $("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
          deferred.resolve( rc_style );
        });

        /*
        * Loading directly as a link...  Not really what we need from this
        */
        /*
        var head = document.getElementsByTagName('head')[0];
        var cssLink = document.createElement("link");
        cssLink.setAttribute("rel", "stylesheet");
        cssLink.setAttribute("type", "text/css");
        cssLink.setAttribute("href", options.url);
        head.appendChild(cssLink);
        deferred.resolve(cssLink);
        */
      }
    },
    "$css": {
      load: function(options, deferred) {
        loader(options.url, "json").done(function(rc_style){
          if( options.element instanceof jQuery ){
            options.element.css(rc_style);
          }
          deferred.resolve( rc_style );
        });
      }
    },
    "less": {
      load: function(options, deferred) {
        loader(options.url, "text").done(function(rc_style){
          //Process less content and then add it to the document as regular css
          //$("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
          deferred.resolve( rc_style );
        });
      }
    }
  };


  return style;
});
