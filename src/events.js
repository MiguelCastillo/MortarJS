define(["src/extender"], function(Extender) {
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
  };


  converters.string = function(events, cb, context) {
    if ( typeof arguments[0] !== "string" ) {
      return;
    }

    // Handle multiple comma delimited events
    events = events.split(",");

    var settings = {events: {}},
        length = events.length,
        i = 0;

    for ( ; i < length; i++ ) {
      settings.events[events[i]] = factory.normalize.apply(this, [events[i], cb, context]);
    }

    return settings;
  };


  //
  // Event factory...
  //
  var factory = {};


  // Takes part of events and convets it into a object with
  // all relevant parts.
  factory.normalize = function ( evt, handler, context ) {
    evt = evt.split(" ");
    var type     = evt.shift(),
        selector = evt.join(" ") || null,
        custom   = type.split(":").length !== 1;

    if ( typeof handler === "string" ) {
      handler = this[handler];
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
  };


  factory.bind = function() {
    var $this    = $(this);
    var settings = Events.configure.apply(this, arguments),
        _events  = settings.events || {},
        _evt;

    // Handle jQuery type of hash events
    for ( var evt in _events ) {
      _evt = _events[evt];

      if ( !_evt.cb ) {
        continue;
      }

      $this.on(_evt.type + "." + Events.prefix, _evt.selector, _evt.cb);
    }

    return this;
  };


  factory.unbind = function() {
    var $this = $(this);

    if (!arguments[0]) {
      $this.off("." + Events.prefix);
    }
    else {
      $this.off.apply($this, arguments);
    }

    return this;
  };



  // Event system
  function Events() {
  }


  Extender.mixin(Events, {
    events: {}
  });


  Events.prefix     = "mortar";
  Events.factory    = factory;
  Events.converters = converters;


  // Replace events.configure if you want to customize how the events are built.
  // E.g. call your own converters in a custom way like using instanceof instead
  // of typeof.
  Events.configure = function() {
    var converter = Events.converters[typeof arguments[0]];
    if ( converter ) {
      return converter.apply(this, arguments);
    }
  };


  Events.prototype.on = function() {
    return Events.factory.bind.apply(this, arguments);
  };


  Events.prototype.off = function() {
    return Events.factory.unbind.apply(this, arguments);
  };


  Events.prototype.trigger = function() {
    var $this = $(this);
    $this.trigger.apply($this, arguments);
    return this;
  };


  Events.prototype.triggerHandler = function() {
    var $this = $(this);
    $this.triggerHandler.apply($this, arguments);
    return this;
  };


  return Events;
});

