define([
  "src/fetch",
  "src/spromise",
  "src/resources",
], function( fetch, promise , resources) {
  "use strict";


  function tmpl(options, selector) {
    if ( this instanceof tmpl === false ) {
      return new tmpl(options, selector);
    }

    options = options || {};
    selector = selector || options.selector || tmpl.selector;

    var _promise = promise(),
        attrSelector = "[" + selector + "]";

    if (typeof options.url === "string" ) {
      tmpl.loader(options)
        .done(_promise.resolve)
        .fail(_promise.reject);
    }
    else if (typeof options.html === "string" ||
             options.html instanceof jQuery === true ) {
      _promise.resolve(options.html);
    }
    else {
      _promise.resolve(options);
    }

    // Handle nested tmpl loading
    return _promise.then(function(_tmpl) {
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

      // If there is no nested
      if (!done.length) {
        return $tmpl;
      }

      return promise.when.apply(tmpl, done).then(function() {
        return $tmpl;
      });
    });
  }


  tmpl.selector = "mjs-tmpl";
  tmpl.loader = fetch;


  // Expose as a resource.  Run it in a self executing function so keep the module clean
  // and so that we can also move the resource registration if need be.
  (function() {
    var resource = resources.resource.extend({
      load: tmpl,
      extension: "html"
    });

    resources.register("tmpl", new resource());
  })();


  return tmpl;
});

