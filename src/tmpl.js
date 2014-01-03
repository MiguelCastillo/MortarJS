/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["mortar/resource"], factory);
  } else {
    // Browser globals
    this.mortar.fragment = factory(this.mortar.resource);
  }
})
(function( resource ) {
  "use strict";


  function fragment(settings, selector) {
    settings = settings || {};
    selector = selector || fragment.selector;

    var deferred = $.Deferred(),
        attrSelector = "[" + selector + "]";

    if (typeof settings.url === "string" ) {
      fragment.loader(settings)
        .done(deferred.resolve)
        .fail(deferred.reject);
    }
    else if (typeof settings.html === "string"
             || settings.html instanceof jQuery === true ) {
      deferred.resolve(settings.html);
    }
    else {
      deferred.resolve(settings);
    }

    // Handle nested fragment loading
    return deferred.then(function(tmpl) {
      var $tmpl = $(tmpl);

      var done = $tmpl.filter(attrSelector)
        .add($tmpl.children(attrSelector))
        .add($tmpl.find(attrSelector))
        .map(function() {
          var $this = $(this);
          return fragment({
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


  fragment.selector = "mjs-fragment";
  fragment.loader = resource;
  return fragment;
});
