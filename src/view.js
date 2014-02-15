define([
  "src/extender",
  "src/events",
  "src/resources",
  "src/spromise"
], function(extender, events, resources, promise) {
  "use strict";


  function loadResources( ) {
    var _self  = this;
    var result;

    if ( !_self.resources && _self.fqn ) {
      _self.resources = {
        "tmpl!url": ""
      };
    }

    result = baseview.resources(_self.resources, _self.fqn);
    return promise.when(result.tmpl, result.model, result.style)
      .then(function(tmpl, model /*, style*/) {
        _self.tmpl  = tmpl || _.result(_self, "tmpl");
        _self.model = model || _.result(_self, "model");
        return result;
      });
  }


  function initResources( ) {
    var _self = this,
        tmpl = _self.tmpl,
        model = _self.model;

    if ( tmpl ) {
      _self.$el.empty().append($(tmpl[0]));
    }

    if ( model ) {
      // If the model is remote, then we will load the data automatically
      // and then do the binding once the data is loaded in the model
      if ( _.result(model, "url") ) {
        return model.read().then(function(){
          model.bind(_self.$el);
        });
      }
      else {
        model.bind(_self.$el);
      }
    }
  }


  //
  // Base view
  //
  function baseview(options) {
    var _self    = this,
      deferred = promise(),
      settings = baseview.configure.apply(_self, arguments);

    _.extend(_self, settings.options);
    _self.$el.addClass(_self.className);
    _self.on(_self.events).on(settings.events);
    _self.on.call(_self.$el, _self.events, _self);
    _self.on.call(_self.$el, settings.events, _self);

    // Add ready callback so that it is possible to know when a view is ready
    _self.ready = deferred.done;

    // Load resources so that they can then be further processed by _init.
    promise.when(loadResources.call(_self))
    .then(function() {
      return promise.when(_self._init(options));
    })
    .then(function() {
      return promise.when(initResources.call(_self));
    })
    .then(function() {
      return promise.when(_self._create(options));
    })
    .then(function() {
      _self._create();
      _self.trigger("view:ready", [_self, options]);
      deferred.resolve(_self);
    });
  }


  // Extend the prototype for baseview
  extender.mixin(baseview, {
    tagName: "div",
    className: "view",
    _init: $.noop,
    _create: $.noop,
    _destroy: $.noop
  }, events);


  baseview.prototype.destroy = function destroy() {
    // Callback
    this._destroy();
    this.trigger("view:destroy");

    if ( this.model ) {
      this.model.unbind();
    }

    // Clean up bound events for the view and the dom element container
    this.off().off.call(this.$el);

    // Remove dom element
    this.$el.remove();
  };


  baseview.prototype.transition = function (view, selector) {
    var lastView = this._lastView;

    if ( lastView === view ) {
      return;
    }

    // Notify of the transition.
    this.trigger("view:transition", [view, lastView]);

    if ( lastView ) {
      // Tell the view it is going out of scope
      lastView.trigger("view:leave", [this]);

      // Destroy the view?
      if ( this.managed !== false &&
          typeof lastView.destroy === "function" ) {
        lastView.destroy();
      }
    }

    // Save the new view to properly do the next transition
    this._lastView = view;

    // Append the view el to the container we have configured in the
    // routedView.
    if (selector) {
      $(selector, this.$el).append(view.$el || view);
    }
    else {
      this.$el.append(view.$el || view);
    }

    view.trigger("view:enter", [this]);
  };


  //
  // Configure will promote a few fields to main properties...
  // events, tagName, and $el
  // It will also make sure that a view gets the proper settings
  //
  baseview.configure = function ( options ) {
    if ( options instanceof jQuery ) {
      options = { $el: options };
    }
    else {
      options = _.extend({}, options);
    }

    // Keep events separate so that we dont override events when creating instances.
    var events = _.extend({}, options.events);
    delete options.events;

    var tagName = options.tagName || this.tagName;
    options.$el = options.$el || $("<" + tagName + ">");

    // Path is a special property used for resolving resources that are relative to
    // the view.
    var fqn = options.fqn || this.fqn;
    if ( fqn ) {
      var _name = fqn.split("/");
      options.name = _name.pop();
      options.namespace = _name.join(".");
      options.path = fqn;
    }

    // Figure out the class name.
    options.className = options.className || options.name || this.className;

    return {
      events: events,

      // Options will be mixed in with the view instance.  All other properties
      // outside of this object will be treated as transient options that are not
      // persisted in the view instance.
      options: options
    };
  };


  // Resources
  baseview.resources = resources;


  return baseview;
});

