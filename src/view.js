/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */

define([
  "mortar/extender",
  "mortar/events",
  "mortar/fragment",
  "mortar/model",
  "mortar/style"
], function(extender, events, fragment, model, style) {
  "use strict";

  var handlers = {
    "tmpl": fragment,
    "model": model,
    "style": style
  };


  function getResource(resource, handler) {
    if (!handler || !handlers[handler]) {
      return;
    }

    // Check for any hints of file extension.  If one does not exist,
    // then infer it based on the handler.
    if ( resource.url && resource.url.lastIndexOf(".") === -1 ) {
      switch (handler) {
        case "style":
          resource.url += ".css";
          break;
        case "tmpl":
          resource.url += ".html";
          break;
        case "model":
          resource.url += ".js";
          break;
      }
    }

    return handlers[handler](resource);
  }


  function loadResources(resources) {
    // wire up to requirejs
    var _self = this;
    var resource, parts, data, config, handler, result = {};

    for ( var i in resources ) {
      resource = resources[i];

      // Handle url items
      if ( /^[url|html|data|css|less]+!/.test(resource) ) {
        parts     = /^(\w+)!(.*)/.exec(resource);
        data      = parts.pop();
        config    = {}, config[parts.pop()] = data || _self.path;
        result[i] = getResource( config, i );
      }
      else {
        result[i] = resource;
      }
    }

    return $.when(result["tmpl"], result["style"], result["model"])
      .then(function(tmpl, style, model) {
        if ( tmpl ) {
          _self.$el.empty().append($(tmpl));
        }

        if ( style ) {
          // Nothing. The style just gets loaded and we are done.
        }

        if ( model ) {
        }

        return result;
      });
  }


  //
  // Base view
  //
  function baseview(options) {
    var _self = this;
    var deferred = $.Deferred();
    var settings = baseview.configure.apply(this, arguments);

    // Mixin options
    $.extend(this, settings.options);

    // Setup the target element and events
    this.$el.addClass(_self.className);

    // Bind base events and optional events for the view and the dom element container
    this.on(this.events).on(settings.events);
    this.on.call(this.$el, this.events, this);
    this.on.call(this.$el, settings.events, this);

    // Add ready callback so that it is possible to know when a view is ready
    this.ready = deferred.done;

    // Before anything is done, I am calling init with the $el in place
    // in case there is a need to setup anything on the dom before loading
    // up all the resources.
    // _init can return a promise object...  Maybe there is a need to do
    // some async work before loading the resources.
    // _create can also return a promise object
    //
    // Let the thread continue to execute without blocking while the view
    // is initialized.
    //
    $.when(_self._init(options))
    .then(function() {
      return loadResources.call(_self, _self.resources);
    })
    .then(function() {
      return $.when(_self._create(options));
    })
    .then(function() {
      _self.trigger("view:ready", [_self, options]);
      deferred.resolve(_self);
    });
  }


  // Extend the prototype for baseview
  extender.expand(baseview, {
    tagName: "div",
    className: "view",
    events: {},
    _init: $.noop,
    _create: $.noop,
    _destroy: $.noop
  }, events);


  baseview.prototype.destroy = function destroy() {
    // Callback
    this.trigger("_destroy").trigger("view:destroy");

    // Clean up bound events for the view and the dom element container
    this.off().off.call(this.$el);

    // Remove dom element
    this.$el.remove();
  }


  baseview.prototype.transition = function (view, selector) {
    var lastView = this._lastView;

    if ( lastView == view ) {
      return;
    }

    // Notify of the transition.
    this.trigger("view:transition", [view, lastView]);

    if ( lastView ) {
      // Tell the view it is going out of scope
      lastView.trigger("view:leave", [this]);

      // Destroy the view?
      if ( this.managed !== false
          && typeof lastView.destroy === "function" ) {
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
  }


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
      options = $.extend({}, options);
    }

    // Keep events separate so that we dont override events when creating instances.
    var events = $.extend({}, options.events);
    delete options.events;

    var tagName = options.tagName || this.tagName;
    options.$el = options.$el || $("<" + tagName + ">");

    // Path is a special property used for resolving resources that are relative to
    // the view.
    var path = options.path || this.path;
    if ( path ) {
      var _name = path.split("/");
      options.name = _name.pop();
      options.namespace = _name.join(".");
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
  }


  return baseview;
});

