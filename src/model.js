define([
  "src/extender",
  "src/events",
  "src/scpromise"
],function(extender, events, promise) {
  "use strict";


  //
  // Datasource is an interface for providing CRUD capabilities
  //
  function datasource(type, data, options) {
    options = options || {};
    var _data;
    var settings = {
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
      return datasource.transaction(settings);
    }
    else {
      throw "Must provide a url in order to make ajax calls.  Optionally, you can override or provide a custom data source that does not require a url.";
    }
  }


  // Replace this interface if you wish to only override the point at which
  // the ajax request happens
  datasource.transaction = $.ajax;


  //
  // CRUD interfaces
  //
  function crud() {
  }


  // Create item in datasource
  crud.prototype.create = function(data, options) {
    return promise.when(this.datasource("post", data, options)).then(function(data){
      return data;
    });
  };


  // Read item from datasource
  crud.prototype.read = function(data, options) {
    return promise.when(this.datasource("get", data, options)).then(function(data) {
      this.serialize(data);
      return data;
    });
  };


  // Update item in the server
  crud.prototype.update = function(data, options) {
    return promise.when(this.datasource("put", data, options)).then(function(data){
      return data;
    });
  };


  // Delete item from the server
  crud.prototype.remove = function(data, options) {
    return promise.when(this.datasource("delete", data, options)).then(function(data){
      return data;
    });
  };




  //
  // Model definition
  //

  function model( data, options ) {
    if ( this instanceof model === false ) {
      return new model( data, options );
    }

    // Configure model
    var settings = model.configure.apply(this, arguments);

    // Setup events
    this.on(this.events).on(settings.events);

    // Mixin all the options
    _.extend(this, settings.options);

    // Serialize
    this.serialize(this.defaultdata);
  }



  // Assign request factory to model for direct access.  You can override
  // request or request.send in order to customize how data is transfered.
  model.datasource = datasource;


  extender.mixin(model, {
    ajax: {
      dataType: "json"
    },
    bind: $.noop,
    unbind: $.noop
  }, events, crud);


  /*
  * When options are passed in, then data is exlusively data model.  Otherwise,
  * we will pluck properties out of data to configure the model.  E.g. data.data
  * and data.url
  */
  model.configure = function( data, options ) {
    var _url;

    // Working through some hoops to provide a flexible way to specify a url and data.
    // 1. data is a string, then data is the url
    // 2. data.url is a string and no options are provided, then data.url is the url.
    //    This particular point is where I bend the rules a bit.  How do we tell if url
    //    is the actual url for the model or just a property in the model data?
    //    So, if data.url exists and options does not, then we assume data.url is the
    //    model's url.  If data.url exists and also options, then data.url is a proeprty
    //    in the model's data.  This gives me the most flexible approach
    // 3. options is a string, then options is the url.
    // 4. options.url is a string, then options.url is the url.

    if ( typeof data === "string" || typeof data === "function" ) {
      _url = data;

      // data will be initialized when fetching from the datasource.  At that point
      // the proper data type will be set
      data = null;
    }
    else if ( typeof options === "string" || typeof options === "function" ) {
      _url = options;
      options = null;
    }
    else if ( !options && data ) {
      // Items that can be used as options in a data object when an options object is
      // not explicitly provided.
      if ( data.data || data.url || data.events || data.datasource ) {
        options = _.extend({}, data);

        // Setup direct access to the data.  data.data could be undefined or null, which is
        // fine because the data and its type will be properly setup during serialization
        data = data.data;
      }
    }


    // Ensure valid options object
    options = options || {};

    // Default data
    options.defaultdata = data;

    // Datasource to deal with data persistence
    options.datasource = options.datasource || model.datasource

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



  //
  // Interfaces below are for converting data suitable for datasource consumption
  // and UI consumption.
  //

  // Interface to take data from a datasource and converting to a format that's
  // suitable for the UI
  model.prototype.serialize = function(data, options) {
    // Init the data
    if ( !this.data ) {
      this.data = data;
    }
    else {
      if ( this.data instanceof Array ) {
        this.data.splice(0, this.data.length); // Clean array
        this.data.push.apply(this, data);      // Add new data
      }
      else {
        _.extend(this.data, data);
      }
    }
  };


  // Interface to convert model data to something suitable for consumption by the
  // datasrouce.  E.g. http request, local storage, cookie...
  model.prototype.deserialize = function() {
    return this.data;
  };


  //
  // Interfaces below are for data access
  //

  // Gets current value of a model propertry
  model.prototype.get = function(property) {
    return this.data[property];
  };


  // Sets the new value of a model property
  model.prototype.set = function(property, value) {
    this.data[property] = value;
  };


  return model;
});

