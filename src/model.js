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


  function request(type, data, options) {
    options = options || {};
    var _data,
        settings = {
          context: this,
          type: type,
          url: _.result({url: options.url || this.url}, "url")
        };

    switch( type.toLocaleLowerCase() ) {
      case "post":
      case "put": {
        _data = _.result({data: data || this.deserialize}, "data");
        settings.data = (_data && JSON.stringify(_data));
        settings.contentType = "application/json; charset=utf-8";
        break;
      }
      default: {
        _data = _.result({data: data || this.deserialize}, "data");
        settings.data = (_data && JSON.stringify(_data));
        break;
      }
    }

    _.extend(settings, this.ajax, options.ajax);
    return request.send(settings);
  }


  request.send = function(settings) {
    return $.ajax(settings);
  }


  function model( data, options ) {
    var settings = model.configure.apply(this, arguments);
    this.on(this.events).on(settings.events);

    // Init the data
    this.data = _.extend({}, this.data, data);

    // Add data to the model...
    _.extend(this, settings.options);
  }


  extender.expand(model, {
    ajax: {
      dataType: "json"
    },
    bind: $.noop,
    unbind: $.noop
  }, events);


  model.configure = function( data, options ) {
    if ( typeof options === "string" ) {
      options = {
        "url": options
      };
    }
    else {
      options = _.extend({}, options);
    }

    var events = options.events || {};
    delete options.events;

    return {
      data: data,
      events: events,
      options: options
    };
  };


  // Assign request factory to model for direct access.  You can override
  // request or request.send in order to customize how data is transfered.
  model.request = request;


  model.prototype.deserialize = function() {
    return this.data;
  };


  // Gets current value of a model propertry
  model.prototype.get = function(property) {
    return this.data[property];
  };


  // Sets the new value of a model property
  model.prototype.set = function(property, value) {
    this.data[property] = value;
  };


  // Create item in the server
  model.prototype.create = function(data, options) {
    return model.request.call(this, "post", data, options).done(function(data){
      return data;
    });
  };


  // Create item from the server
  model.prototype.read = function(data, options) {
    return model.request.call(this, "get", data, options).done(function(data){
      _.extend(this.data, data);
      return data;
    });
  };


  // Update item in the server
  model.prototype.update = function(data, options) {
    return model.request.call(this, "put", data, options).done(function(data){
      return data;
    });
  };


  // Remove item from the server
  model.prototype.remove = function(data, options) {
    return model.request.call(this, "delete", data, options).done(function(data){
      return data;
    });
  };


  return model;
});

