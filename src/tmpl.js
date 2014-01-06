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
    this.mortar.tmpl = factory(this.mortar.fetch);
  }
})
(function( fetch ) {
  "use strict";


  function tmpl(options, selector) {
    if ( this instanceof tmpl === false ) {
      return new tmpl(options, selector);
    }

    options = options || {};
    selector = selector || options.selector || tmpl.selector;

    var deferred = $.Deferred(),
        attrSelector = "[" + selector + "]";

    if (typeof options.url === "string" ) {
      tmpl.loader(options)
        .done(deferred.resolve)
        .fail(deferred.reject);
    }
    else if (typeof options.html === "string"
             || options.html instanceof jQuery === true ) {
      deferred.resolve(options.html);
    }
    else {
      deferred.resolve(options);
    }

    // Handle nested tmpl loading
    return deferred.then(function(_tmpl) {
      var $tmpl = $(_tmpl);

      var done = $tmpl.filter(attrSelector)
        .add($tmpl.children(attrSelector))
        .add($tmpl.find(attrSelector))
        .map(function() {
          var $this = $(this);
          return tmpl({
              "url": $this.attr(selector)
            })
            .done(function(_tmpl){
              $this.append($(_tmpl));
            });
        });

      return $.when.apply($, done).then(function() {
        return $tmpl;
      });
    });
  }


  tmpl.selector = "mjs-tmpl";
  tmpl.loader = fetch;
  return tmpl;
});
