define([
  "src/extender",
  "src/events",
  "src/resources",
  "src/spromise"
], function(extender, events, resources, promise) {
  "use strict";


  function loadResources(_self) {
    var resources = _self.resources || {},
        fqn       = _self.fqn;
    var result, promises;

    result = baseview.resources(resources, fqn);

    if ( !result.tmpl ) {
      result.tmpl = _.result(_self, "tmpl") || (fqn && baseview.resources(["tmpl!url"], fqn).tmpl);
    }

    if ( !result.style && _self.style ) {
      _self.style = _.result(_self, "style");
    }

    if ( !result.model && _self.model ) {
      _self.model = _.result(_self, "model");
    }

    promises = _.map(result, function( value, key ) {
      promise.when(value).done(function(val) {
         _self[key] = val || _.result(resources, key);
      });
      return value;
    });

    return promise.when.apply(_self, promises);
  }


  function initResources(_self) {
    var tmpl = _self.tmpl,
        model = _self.model;

    if ( tmpl ) {
      _self.$el.empty().append(tmpl);
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

    if ( _self.events ) {
      _self.on(_self.events);
      _self.on.call(_self.$el, _self.events, _self);
    }

    if ( settings.events ) {
      _self.on(settings.events);
      _self.on.call(_self.$el, settings.events, _self);
    }

    _.extend(_self, settings.options);
    _self.$el.addClass(_self.className);
    _self.ready = deferred.done;

    // Load resources so that they can then be further processed by _init.
    promise.when(loadResources(_self))
    .then(function() {
      return promise.when(_self._init(options));
    })
    .then(function() {
      return promise.when(initResources(_self));
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

    options.settings = options.settings || {};

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
      options.settings.name      = _name.pop();
      options.settings.path      = _name.join("/");
      options.settings.namespace = _name.join(".");
    }

    // Figure out the class name.
    options.className = options.className || options.settings.name || this.className;

    return {
      events: events,

      // Options will be mixed in with the view instance.  All other properties
      // outside of this object will be treated as transient options that are not
      // persisted in the view instance.
      options: options
    };
  };


  baseview.resources = resources;
  return baseview;
});

