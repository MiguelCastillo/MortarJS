define([
  "src/fetch",
  "src/spromise",
  "src/resources"
], function( Fetch, Promise, Resources) {
  "use strict";


  function Tmpl(options, selector) {
    if ( this instanceof Tmpl === false ) {
      return new Tmpl(options, selector);
    }

    return this.load(options, selector);
  }


  Tmpl.prototype.load = function(options, selector) {
    options = options || {};
    selector = selector || options.selector || Tmpl.selector;

    var _self = this,
        _promise = Promise.defer(),
        attrSelector = "[" + selector + "]";

    if (typeof options.url === "string" ) {
      Tmpl.loader(options)
        .done(_promise.resolve)
        .fail(_promise.reject);
    }
    else if (typeof options.html === "string" || options.html instanceof jQuery === true ) {
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
          return _self.load({
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

      return Promise.when.apply(_self, done).then(function() {
        return $tmpl;
      });
    });
  };


  Tmpl.selector = "mjs-tmpl";
  Tmpl.loader = Fetch;


  // Expose as a resource.  Run it in a self executing function so keep the module clean
  // and so that we can also move the resource registration if need be.
  (function() {
    var Resource = Resources.resource.extend({
      load: Tmpl,
      extension: "html"
    });

    Resources.register("tmpl", new Resource());
  })();


  return Tmpl;
});

