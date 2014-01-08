define(["mortar/extender"], function(extender) {
  "use strict";

  // Converters is a hash of the different type of events we can
  // take in order to create events handlers.  Extend this if you
  // want to add your own types of events converters.
  var converters = {};


  converters.object = function(events, context) {
    if ( typeof arguments[0] !== "object" ) {
      return;
    }

    var settings = {events: {}};

    for ( var evt in events ) {
      settings.events[evt] = factory.normalize.apply(this, [evt, events[evt], events[evt].context || context]);
    }

    return settings;
  }


  converters.string = function(events, cb, context) {
    if ( typeof arguments[0] !== "string" ) {
      return;
    }

    var settings = {events: {}},

        // Handle multiple comma delimited events
        events = events.split(","),
        length = events.length,
        i = 0;

    for ( ; i < length; i++ ) {
      settings.events[events[i]] = factory.normalize.apply(this, [events[i], cb, context]);
    }

    return settings;
  }


  //
  // Event factory...
  //
  function factory() {
  }


  // Takes part of events and convets it into a object with
  // all relevant parts.
  factory.normalize = function ( evt, handler, context ) {
    var _evt      = evt.split(" "),
        type      = _evt.shift(),
        selector  = _evt.join(" ") || null,
        custom    = type.split(":").length !== 1;

    if ( typeof handler === "string" ) {
      handle = this[handler];
    }

    // Bind a context if one is provided
    if ( context && typeof handler === "function" ) {
      handler = $.proxy(handler, context);
    }

    return {
      type: type,
      selector: selector,
      cb: handler,
      custom: custom
    };
  }


  factory.bind = function() {
    var $this    = $(this);
    var settings = events.configure.apply(this, arguments),
        _events  = settings.events || {},
        _evt;

    // Handle jQuery type of hash events
    for ( var evt in _events ) {
      _evt = _events[evt];

      if ( !_evt.cb ) {
        continue;
      }

      $this.on(_evt.type + "." + events.prefix, _evt.selector, _evt.cb);
    }

    return this;
  }


  factory.unbind = function() {
    var $this = $(this);

    if (!arguments[0]) {
      $this.off("." + events.prefix);
    }
    else {
      $this.off.apply($this, arguments);
    }

    return this;
  }



  // Event system
  function events() {
  }


  extender.mixin(events, {
    events: {}
  });


  events.prefix     = "mortar";
  events.factory    = factory;
  events.converters = converters;


  // Replace events.configure if you want to customize how the events are built.
  // E.g. call your own converters in a custom way like using instanceof instead
  // of typeof.
  events.configure = function() {
    var converter = events.converters[typeof arguments[0]];
    if ( converter ) {
      return converter.apply(this, arguments);
    }
  }


  events.prototype.on = function() {
    return events.factory.bind.apply(this, arguments);
  }


  events.prototype.off = function() {
    return events.factory.unbind.apply(this, arguments);
  }


  events.prototype.trigger = function(type) {
    var $this = $(this);
    $this.trigger.apply($this, arguments);
    return this;
  }


  events.prototype.triggerHandler = function(type) {
    var $this = $(this);
    $this.triggerHandler.apply($this, arguments);
    return this;
  }


  return events;
});


