define([
  "src/fetch",
  "src/spromise",
  "src/resources"
], function( fetch, promise, resources ) {
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

    var _promise = promise();
    options = options || {};

    if (typeof options.url === "string") {
      options.type = options.type || getType(options.url);
      var handler = style.handler[options.type];
      if (handler) {
        handler.load(options, _promise);
      }
    }
    else {
      _promise.reject("No suitable option");
    }

    return _promise;
  }


  style.handler = {
    "css": {
      dataType: "text",
      load: function(options, _promise){
        loader(options.url, "text").done(function(rc_style){
          $("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
          _promise.resolve( rc_style );
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
        _promise.resolve(cssLink);
        */
      }
    },
    "$css": {
      load: function(options, _promise) {
        loader(options.url, "json").done(function(rc_style){
          if( options.element instanceof jQuery ){
            options.element.css(rc_style);
          }
          _promise.resolve( rc_style );
        });
      }
    },
    "less": {
      load: function(options, _promise) {
        loader(options.url, "text").done(function(rc_style){
          //Process less content and then add it to the document as regular css
          //$("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
          _promise.resolve( rc_style );
        });
      }
    }
  };


  // Expose as a resource.  Run it in a self executing function so keep the module clean
  // and so that we can also move the resource registration if need be.
  (function() {
    var resource = resources.resource.extend({
      load: style,
      extension: "css"
    });

    resources.register("style", new resource());
  })();

  return style;
});
