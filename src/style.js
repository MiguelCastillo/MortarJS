define([
  "src/fetch",
  "src/spromise",
  "src/resources"
], function( Fetch, Promise, Resources ) {
  "use strict";


  function getTypeFromExtension(name) {
    var offset = name.lastIndexOf(".");
    if ( offset !== -1 ) {
      return name.substr(offset + 1);
    }
  }


  function loader(url, dataType) {
    return Fetch.load({
      "url": url,
      "ajax": {
        dataType: dataType
      }
    });
  }


  function Style(options) {
    if (this instanceof Style === false) {
      return new Style(options);
    }

    return this.load(options);
  }


  Style.prototype.load = function(options) {
    var _promise = Promise.defer();
    options = options || {};

    if (typeof options.url === "string") {
      Style.adapters.url(options).done(_promise.resolve);
    }
    else {
      _promise.reject("No suitable option");
    }

    return _promise;
  };


  Style.adapters = {
    "url": function(options) {
      options.type = options.type || getTypeFromExtension(options.url);
      var type = Style.types[options.type];
      if (type) {
        return type.load(options);
      }
    }
  };


  Style.types = {
    "css": {
      dataType: "text",
      load: function(options){
        return loader(options.url, "text").done(function(rc_style){
          $("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
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
        */
      }
    },
    "$css": {
      load: function(options) {
        return loader(options.url, "json").done(function(rc_style){
          if( options.element instanceof jQuery ){
            options.element.css(rc_style);
          }
        });
      }
    },
    "less": {
      load: function(options) {
        return loader(options.url, "text").done(function(rc_style){
          //Process less content and then add it to the document as regular css
          //$("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
        });
      }
    }
  };


  // Expose as a resource.  Run it in a self executing function so keep the module clean
  // and so that we can also move the resource registration if need be.
  (function() {
    var Resource = Resources.resource.extend({
      load: Style,
      extension: "css"
    });

    Resources.register("style", new Resource());
  })();

  return Style;
});
