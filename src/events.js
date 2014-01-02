/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    this.mortar.events = factory();
  }
})
(function() {
  "use strict";

  // Converters is a hash of the different type of events we can
  // take in order to create events handlers.  Extend this if you
  // want to add your own types of events converters.
  var converters = {};


  converters.object = function(evts, context) {
    if ( typeof arguments[0] !== "object" ) {
      return;
    }

    var settings = {evts: {}};

    for ( var evt in evts ) {
      settings.evts[evt] = factory.normalize.apply(this, [evt, evts[evt], evts[evt].context || context]);
    }

    return settings;
  }


  converters.string = function(evts, cb, context) {
    if ( typeof arguments[0] !== "string" ) {
      return;
    }

    var settings = {evts: {}}

        // Handle multiple comma delimited events
        evts = evts.split(","),
        i = 0,
        length = evts.length;

    for ( ; i < length; i++ ) {
      settings.evts[evts[i]] = factory.normalize.apply(this, [evts[i], cb, context]);
    }

    return settings;
  }


  //
  // Event factory...
  // Replace events.factory if you want to customize how the events are built.
  // E.g. call your own converters in a custom way like using instanceof instead
  // of typeof.
  //
  function factory() {
    var converter = events.converters[typeof arguments[0]];
    if ( converter ) {
      return converter.apply(this, arguments);
    }
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
    var settings = events.factory.apply(this, arguments),
        _events  = settings.evts || {},
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


  _.extend(events.prototype,{
    events: {}
  });


  events.prefix     = "mortar";
  events.factory    = factory;
  events.converters = converters;


  events.prototype.on = function() {
    return factory.bind.apply(this, arguments);
  }


  events.prototype.off = function() {
    return factory.unbind.apply(this, arguments);
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


