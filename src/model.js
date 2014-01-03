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

    if ( settings.url ) {
      return request.send(settings);
    }
    else {
      throw "Must provide a url in order to make ajax calls";
    }
  }


  request.send = function(settings) {
    return $.ajax(settings);
  }


  function model( data, options ) {
    if ( this instanceof model === false ) {
      return new model( data, options );
    }

    var settings = model.configure.apply(this, arguments);
    this.on(this.events).on(settings.events);

    // Init the data
    this.data = _.extend({}, this.data, settings.data);

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
    data = data || {};

    // Working through some hoops to provide a flexible way to specify a url.
    // 1. data is a string, then data is the url
    // 2. data.url is a string and no options are provided, then data.url is the url.
    //    This particular point is where I bend the rules a bit.  How do we tell if url
    //    is the actual url for the model or just a property in the model data?
    //    So, if data.url exists and options does not, then we assume data.url is the
    //    model's url.  If data.url exists and also options, then data.url is a proeprty
    //    in the model's data.  This gives me the most flexible approach
    // 3. options is a string, then options is the url.
    // 4. options.url is a string, then options.url is the url.
    var _url;

    if ( typeof data === "string" ) {
      _url = data;
      data = {};
    }
    else if ( typeof options === "string" ) {
      _url = options;
      options = {};
    }
    else if ( typeof data.url === "string" && !options ) {
      _url = data;
      delete data.url;
    }
    // If data has a property data and no options are passed in, then we will treat data
    // as the options and extract data.data as the actual data for the model.  This is a
    // way to pass in a single object with options and data in all in one object.
    else if ( typeof data.data === "object" && !options ) {
      options = _.extend({}, data);
      delete options.data;
      data = data.data;
    }

    // Ensure valid options object
    options = options || {};

    // Ensure valid url, if one is provided
    if (_url) {
      options.url = _url;
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

