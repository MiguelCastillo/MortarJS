/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["mortar/extender", "mortar/events"], factory);
  } else {
    // Browser globals
    this.mortar.model = factory(this.mortar.extender, this.mortar.events);
  }
})
(function(extender, events, resource) {
  "use strict";


  function model( ) {
    var settings = model.configure.apply(this, arguments);
    $.extend(this, settings.options);
    this._data = this._data || {};
    this.on(this.events).on(settings.events);
  }


  extender.expand(model, {
    ajax: {
      dataType: "json"
    },
    bind: $.noop,
    unbind: $.noop
  }, events);


  model.configure = function(options) {
    options = _.extend({}, options);
    var events = options.events || {};
    delete options.events;

    return {
      events: events,
      options: options
    };
  };


  model.request = function(settings) {
    return $.ajax(settings);
  };


  model.xconfigure = function(type, data, options) {
    options = options || {};
    var settings = {
      context: this,
      type: type,
      url: _.result({url: options.url || this.url}, "url")
    }, _data;

    switch( type.toLocaleLowerCase() ) {
      case "post":
      case "put": {
        _data = _.result({data: data || this.data}, "data");
        settings.data = _data ? JSON.stringify(_data) : null;
        settings.contentType = "application/json; charset=utf-8";
        break;
      }
      default: {
        _data = _.result({data: data || this.data}, "data");
        settings.data = _data ? JSON.stringify(_data) : null;
        break;
      }
    }

    return _.extend(settings, this.ajax, options.ajax);
  };


  // Gets current value
  model.prototype.get = function(property) {
    return this._data[property];
  };


  // Sets the new value
  model.prototype.set = function(property, value) {
    this._data[property] = value;
  };


  model.prototype.create = function(data, options) {
    var _self    = this,
        settings = model.xconfigure.call(this, "post", data, options);

    return model.request.call(this, settings).then(function(data){
      return data;
    });
  };


  model.prototype.read = function(data, options) {
    var _self = this,
        settings = model.xconfigure.call(this, "get", data, options);

    return model.request.call(this, settings).then(function(data){
      _.extend(this._data, data);
      return data;
    });
  };


  model.prototype.update = function(data, options) {
    var _self = this,
        settings = model.xconfigure.call(this, "put", data, options);

    return model.request.call(this, settings).then(function(data){
      return data;
    });
  };


  model.prototype.remove = function(data, options) {
    var _self = this,
        settings = model.xconfigure.call(this, "delete", data, options);

    return model.request.call(this, settings).then(function(data){
      return data;
    });
  };


  return model;
});

