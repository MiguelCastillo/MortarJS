define([
  "src/extender",
  "src/events",
  "src/resources",
  "src/spromise",
  "src/utils"
], function(Extender, Events, Resources, Promise, Utils) {
  "use strict";


  function loadResources(_self) {
    var resources = _self.resources || (_self.resources = {}),
        fqn       = _self.fqn,
        result    = View.resources(resources, fqn);
    var promises;


    //
    // tmpl, style, and model are resources that can be setup right in the view itself.  These
    // are special resources, and they can be defined in the view directly because they are so
    // common I wanted to provide a less verbose way to defined them to reduce boilerplate code.
    //


    //
    // * The only resource that is really required for a view is a template... What good is a
    // view if it does not render anything?  That's why I will force loading of a template via
    // the resource manager if I can't explicitly find one defined in the settings.
    //
    if (!result.tmpl && result.tmpl !== false) {
      result.tmpl = Utils.result(_self, "tmpl") || (fqn && View.resources(["tmpl!url"], fqn).tmpl);
    }

    if (!result.style && _self.style) {
      result.style = Utils.result(_self, "style");
    }

    if (!result.model && _self.model) {
      result.model = Utils.result(_self, "model");
    }

    promises = _.map(result, function(value, key) {
      Promise.when(value).done(function(val) {
        _self[key] = val;

        // Immediately try to resolve resources that may have been defined as a function.
        _self[key] = Utils.result(_self, key);
      });
      return value;
    });

    return Promise.all.call(_self, promises);
  }


  function initResources(_self) {
    var tmpl      = _self.tmpl,
        model     = _self.model,
        resources = _self.resources;

    if ( tmpl ) {
      _self.$el.append(tmpl);
    }

    if ( model ) {
      model.bind(_self.$el);
    }

    // Iterate through all the resources and make sure we call load passing in the instance of the view
    for (var resource in resources) {
      if (resources.hasOwnProperty(resource) && Utils.isFunction(resources[resource].loaded)) {
        resources[resource].loaded.call(_self[resource], _self);
      }
    }
  }


  /**
   * View
   */
  function View(options) {
    var _self  = this,
      deferred = Promise.defer(),
      settings = View.configure.apply(_self, arguments);

    // This is handling events that were configured when defining a view
    if ( _self.events && settings.pevents !== false ) {
      _self.on(_self.events);
      _self.on.call(_self.$el, _self.events, _self);
    }

    // This is handling events that are passed in to the constructor
    if ( settings.events ) {
      _self.on(settings.events);
      _self.on.call(_self.$el, settings.events, _self);
    }

    Utils.extend(_self, settings.options);
    _self.$el.addClass(_self.className);
    _self.ready = deferred.done;

    // Load resources so that they can then be further processed by _init.
    Promise.when(loadResources(_self))
    .then(function() {
      return Promise.when(_self._init(options));
    })
    .then(function() {
      return Promise.when(initResources(_self));
    })
    .then(function() {
      return Promise.when(_self._create(options));
    })
    .then(function() {
      _self._create();
      _self.trigger("view:ready", [_self, options]);
      deferred.resolve(_self);
    });
  }


  // Extend the prototype for baseview
  Extender.mixin(View, {
    tagName: "div",
    className: "view",
    _init: $.noop,
    _create: $.noop,
    _destroy: $.noop
  }, Events);


  View.prototype.destroy = function destroy() {
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


  View.prototype.transition = function (view, selector) {
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
  View.configure = function ( options ) {
    if ( options instanceof jQuery ) {
      options = { $el: options };
    }
    else {
      options = Utils.extend({}, options);
    }

    options.settings = options.settings || {};

    // Keep events separate so that we dont override events when creating instances.
    var events = Utils.extend({}, options.events);
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


  View.resources = Resources;
  return View;
});

