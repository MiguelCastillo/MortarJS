/**
 * MortarJS Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


(function (root, factory) {
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    // CommonJS support
    module.exports = factory(require("Mortar"), require('ko'));
  } else if (typeof define === 'function' && define.amd) {
    // Do AMD support
    define(factory);
  } else {
    // Do browser support
    root.Mortar = factory();
  }
}(this, function () {
  //almond, and your modules will be inlined here


/**
 * almond 0.2.6 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("lib/js/almond", function(){});

define('src/extender',[],function() {
  


  function extender(/* extend* */) {
    this.extend.apply(this, arguments);
  }


  /**
  * Interface that iterates through all the input properties and prototype objects
  * to extend the instance of extender.
  */
  extender.prototype.extend = function( /* extend+ */ ) {
    var extensions = Array.prototype.slice.call(arguments),
        iextension;

    // Allow n params to be passed in to extend this object
    while(extensions.length) {
      iextension = extensions.shift();

      if ( iextension.constructor === Function ) {
        extender.extension.prototype = iextension.prototype;
        _.extend(this, new extender.extension());
      }
      else {
        _.extend(this, iextension);
      }
    }

    return this;
  };


  /**
  * Base dummy extension to use the prototype as a placeholder when establishing inheritance.
  * Override extension with any other base function that you wish all your prototypical
  * inheritance chains to use.
  */
  extender.extension = function() {};


  /**
  * Interface to setup extending capabilties.  Unlike extend, this will not create
  * a prototypical inheritance chain.
  */
  extender.mixin  = function() {
    var _extender = new extender(),
        args      = Array.prototype.slice.call(arguments),
        base      = args.shift();

    if ( base.constructor === Function ) {
      _extender.extend.apply(base.prototype, args);
      base.prototype.extend = _extender.extend;
    }
    else {
      _extender.extend.apply(base, args);
    }

    base.extend = extender.extend;
    return base;
  };


  /**
  * Interface to setup inheritance
  * Works similar to Object.create, but this takes into account passing in constructors.
  *
  * extender.extend( base, (object || function) * )
  */
  extender.extend = function() {
    var base = this === extender ? arguments[0] : this;

    // Setup extension class to be able to setup inheritance
    if ( base && base.constructor === Function ) {
      extender.extension.prototype = base.prototype;
    }
    else {
      extender.extension.prototype = base;
    }

    // Setup a function the we can instantiate and properly call the proper constructor
    function extension() {
      this.constructor.apply(this, arguments);
    }

    extension.prototype = new extender.extension();
    extension.__super__ = base.prototype;
    extender.mixin.apply(base, [extension].concat.apply(extension, arguments));
    return extension;
  };


  return extender;
});


define('src/events',["src/extender"], function(extender) {
  

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
  };


  factory.unbind = function() {
    var $this = $(this);

    if (!arguments[0]) {
      $this.off("." + events.prefix);
    }
    else {
      $this.off.apply($this, arguments);
    }

    return this;
  };



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
  };


  events.prototype.on = function() {
    return events.factory.bind.apply(this, arguments);
  };


  events.prototype.off = function() {
    return events.factory.unbind.apply(this, arguments);
  };


  events.prototype.trigger = function() {
    var $this = $(this);
    $this.trigger.apply($this, arguments);
    return this;
  };


  events.prototype.triggerHandler = function() {
    var $this = $(this);
    $this.triggerHandler.apply($this, arguments);
    return this;
  };


  return events;
});


define('src/hash.route',[],function() {
  

  var oldHash = "",
      newHash = "",
      enabled = false,
      interval = false,
      hashes = {};


  //
  // Hash handler
  //
  function hash( options ) {
    // Convert simple options passed in as a string to a proper options object.
    if ( typeof options === "string" ) {
      options = {
        pattern: options
      };
    }

    if ( options.pattern in hashes === false ) {
      hashes[options.pattern] = new hash.route(options);
    }

    return hashes[options.pattern];
  }


  // Rate at which to trigger updates whenever they exist
  hash.refreshRate = 10;


  //
  // Enable the entire hashing operation
  //
  hash.enable = function() {
    if ( enabled ) {
      return;
    }

    enabled = true;

    if ( "onhashchange" in window ) {
      $(window).on("hashchange", throttlechange);
      interval = setTimeout(hashchange, hash.refreshRate);
    }
    else {
      interval = setInterval(hashchange, 100);
    }
  };


  //
  // Disable the entire hashing operation
  //
  hash.disable = function(val) {
    if ( enabled === false ) {
      return;
    }

    enabled = false;

    if ( "onhashchange" in window ) {
      $(window).off("hashchange", throttlechange);
      clearTimeout(interval);
    }
    else {
      clearInterval(interval);
    }
  };


  //
  // Allow navigation from hash
  //
  hash.navigate = function(route) {
    window.location.hash = route;
  };


  // Routine to process haschange events
  function hashchange () {
    newHash = '' + window.location.hash;
    if (newHash === oldHash) {
      return;
    }

    $(hash).triggerHandler("change", [newHash, oldHash]);

    // Iterate through all the hashes and fire off a change event if needed.
    for ( var i in hashes ) {
      hashes[i].exec(newHash);
    }

    // Update hashes
    oldHash = newHash;
  }


  // Throttle update events to prevent flooding the hashchanged handler with
  // messages.
  function throttlechange() {
    if ( interval ) {
      clearTimeout(interval);
    }

    interval = setTimeout(hashchange, hash.refreshRate);
  }


  //
  // Match
  //
  function patternMatch(pattern) {
    var rules = patternMatch.rules;

    //
    // String used for building up the regexp matches url patterns.
    // Regex tester: http://jsregex.com/
    //
    var matchString = ('' + pattern)
      .replace(rules.wholeValue.regex, function(match) {
        return match.substr(0, match.indexOf(':')) + rules.wholeValue.rule;
      })
      .replace(rules.optionalValue.regex, function(match) {
        return match.substr(0, match.indexOf(':')) + rules.optionalValue.rule;
      })
      .replace(rules.nameValue.regex, function(match) {
        return match.substr(0, match.indexOf(':')) + rules.nameValue.rule;
      })
      .replace(rules.wildCard.regex, rules.wildCard.rule);

    // Regular expression to match against urls.
    // This pattern matching will allow you to accurately specify
    // if you want to match starting and ending slashes when configuring a
    // hash instance.  So, if you specify a slash when configuring your hash,
    // instance the match will test if a slash is included in the url we are
    // testing against.  If you ommit the slash in the hash object, then the
    // match will pass regadless of whether the matching url has a slash.  E.g.
    //
    // var _hash = hash("home") will match #home and #home/
    // var _hash = hash("home/") will only match #home/
    //
    var matchRegExp = new RegExp("^(?:#*/*)" + matchString + "(?:/*)$");

    return function(uri) {
      return uri.match(matchRegExp);
    };
  }


  patternMatch.rules = {
    wildCard: {
      "regex":/\/\*\*/g,
      "rule": "(?:.*)"
    },
    wholeValue: {
      "regex":/\*\*\w*:\w+/g,
      "rule": "(.*)"
    },
    optionalValue: {
      "regex": /\*\w*:\w+/g,
      "rule": "([^/]*)"
    },
    nameValue: {
      "regex": /\w*:\w+/g,
      "rule": "([^/]+)"
    }
  };



  //
  // Route
  //
  function route(options) {
    var instance = $({}),
        matchUri = patternMatch(options.pattern),
        enabled = true;


    function match( uri ) {
      if ( !enabled ) {
        return false;
      }

      var matches = matchUri(uri);

      if ( matches ) {
        // Javascript regex match will put the match input in the beginning
        // of the matches array.  So, remove it to have a precise 1:1 match
        // with the parameters returned to the callbacks
        instance.lastUrl = matches.shift();
        instance.lastMatch = matches.join("-");
      }
      else {
        // Clear up the value to have a proper initial state when comparing
        // last match again
        instance.lastMatch = undefined;
      }

      return matches;
    }


    function exec( uri ) {
      var lastMatch = instance.lastMatch,
          matches   = match(uri);

      // If there is a match and old and new match are different, then we trigger
      // a route change.
      if ( matches && lastMatch !== instance.lastMatch) {
        instance.triggerHandler("change", matches);
        $(hash).triggerHandler("route:change", [instance, matches]);
      }
    }


    function unregister() {
      $(hashes[instance.pattern]).off();
      delete hashes[instance.pattern];
    }


    function enable(val) {
      if ( arguments.length === 0 ) {
        return enabled === true;
      }
      else {
        enabled = val;
      }
    }


    //
    // Monkey patch $.on method to handle firing off an event with
    // the initial value when event handlers are registered.
    //
    var _onEvent = instance.on;
    function onEvent(/*evt, selector, callback*/) {
      var selector = arguments[1],
          callback = arguments[2];

      if (typeof selector === "function") {
        callback = selector;
        selector = '';
      }

      var matches = instance.match('' + window.location.hash);
      if (matches) {
        matches.unshift( jQuery.Event( "init" ) );
        setTimeout(function() {
          callback.apply(instance, matches);
          $(hash).triggerHandler("route:init", instance);
        }, 1);
      }

      _onEvent.apply(instance, arguments);
      return instance;
    }


    instance.match = match;
    instance.exec = exec;
    instance.unregister = unregister;
    instance.enable = enable;
    instance.pattern = options.pattern;
    instance.on = onEvent;
    return instance;
  }


  hash.patternMatch = patternMatch;
  hash.route = route;


  // Let's start things enabled
  hash.enable();
  return hash;
});



/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define( 'src/async',[],function() {
  var self = this;

  var exec;
  if ( self.setImmediate ) {
    exec = self.setImmediate;
  }
  else if ( self.process && typeof self.process.nextTick === "function" ) {
    exec = self.process.nextTick;
  }
  else {
    exec = function(cb) {
      setTimeout(cb, 0);
    };
  }


  /**
  * Handle exceptions in a setTimeout.
  * @func <function> to be called when timeout finds cycles to execute it
  * @err  <function> to be called when there is an exception thrown.  If
  *  no function is provided then the exception will be rethrown outside
  *  of the setTimeout scope
  */
  function async( ) {
    var args     = arguments,
        func     = arguments[0],
        index    = 1,
        now      = true,
        context  = this,
        instance = {};

    // You can pass in the very first parameter if you want to schedule
    // the task to run right away or whenever run is called
    if ( typeof func === "boolean" ) {
      now = func;
      func = arguments[1];
      index = 2;
    }

    // Readjust args
    args = arguments[index];

    instance.run = function run(fn) {
      exec(runner(fn || func));
    };

    function runner(fn) {
      return function() {
        fn.apply(context, args);
      };
    }

    // Return instance
    return now ? instance.run() : instance;
  }

  return async;
});

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define('src/promise',["src/async"], function (async) {
  

  var states = {
    "pending": 0,
    "resolved": 1,
    "rejected": 2
  };

  var queues = {
    "always": 0,
    "resolved": 1,
    "rejected": 2
  };

  var actions = {
    "resolve": "resolve",
    "reject": "reject"
  };


  /**
   * Small Promise
   */
  function Promise(target, options) {
    // Make sure we have a target object
    target = target || {};
    var stateManager = new StateManager(target, options || {});

    /**
     * callback registration (then, done, fail, always) must be synchrounous so
     * that the callbacks can be registered in the order they come in.
     */

    function then(onResolved, onRejected) {
      return stateManager.then(onResolved, onRejected);
    }

    // Setup a way to verify an spromise object
    then.constructor = Promise;
    then.stateManager = stateManager;


    function done(cb) {
      stateManager.queue(states.resolved, cb);
      return target;
    }

    function fail(cb) {
      stateManager.queue(states.rejected, cb);
      return target;
    }

    function always(cb) {
      stateManager.queue(queues.always, cb);
      return target;
    }

    function state() {
      return stateManager._state;
    }

    function resolve() {
      stateManager.transition(states.resolved, this, arguments);
      return target;
    }

    function reject() {
      stateManager.transition(states.rejected, this, arguments);
      return target;
    }

    function thenable(promise) {
      promise.then(target.resolve, target.reject);
      return target;
    }

    target.always = always;
    target.done = done;
    target.fail = fail;
    target.thenable = thenable;
    target.resolve = resolve;
    target.reject = reject;
    target.then = then;
    target.state = state;
    target.promise = {
      always: always,
      done: done,
      fail: fail,
      then: then,
      state: state
    };

    return target;
  }


  /**
   * Interface to play nice with libraries like when and q.
   */
  Promise.defer = function (target, options) {
    return new Promise(target, options);
  };

  /**
  * Interface to create a promise and link it to a thenable object.  The assumption is that
  * the object passed in is a thenable.  If it isn't, there is no check so an exption might
  * be going your way.
  */
  Promise.thenable = function (thenable) {
    var promise = new Promise();
    return promise.thenable(thenable);
  };

  /**
   * Create a promise that's already rejected
   */
  Promise.rejected = function () {
    return new Promise({}, {
      context: this,
      value: arguments,
      state: states.rejected
    });
  };

  /**
   * Create a promise that's already resolved
   */
  Promise.resolved = function () {
    return new Promise({}, {
      context: this,
      value: arguments,
      state: states.resolved
    });
  };


  /**
   * StateManager is the state manager for a promise
   */
  function StateManager(promise, options) {
    this.promise = promise;

    // If we already have an async object, that means that the state isn't just resolved,
    // but we also have a valid async already initialized with the proper context and data
    // we can just reuse.  This saves on a lot of cycles and memory.
    if (options.async) {
      this.state = options.state;
      this.async = options.async;
    }
    // If a state is passed in, then we go ahead and initialize the state manager with it
    else if (options.state) {
      this.transition(options.state, options.context, options.value);
    }
  }

  // Queue will figure out if the promise is resolved/rejected and do something
  // with the callback based on that.
  StateManager.prototype.queue = function (state, cb) {
    // Queue it up if we are still pending over here
    if (!this.state) {
      (this.deferred || (this.deferred = [])).push({
        type: state,
        cb: cb
      });
    }
    // If the promise is already resolved/rejected
    else if (this.state === state) {
      this.async.run(cb);
    }
  };

  // Tell everyone we are resolved/rejected
  StateManager.prototype.notify = function () {
    var deferred = this.deferred,
      queueType = this.state,
      i = 0,
      length = deferred.length,
      item;

    do {
      item = deferred[i++];
      if (item.type === queueType || item.type === queues.always) {
        this.async.run(item.cb);
      }
    } while (i < length);

    // Clean up memory when we are done processing the queue
    this.deferred = null;
  };

  // Sets the state of the promise and call the callbacks as appropriate
  StateManager.prototype.transition = function (state, context, value) {
    if (!this.state) {
      this.state   = state;
      this.context = context;
      this.value   = value;
      this.async   = async.call(context, false, (void 0), value);
      if (this.deferred) {
        this.notify();
      }
    }
  };

  // Links together the resolution of promise1 to promise2
  StateManager.prototype.then = function (onResolved, onRejected) {
    var resolution, promise2;
    onResolved = typeof (onResolved) === "function" ? onResolved : null;
    onRejected = typeof (onRejected) === "function" ? onRejected : null;

    if ((!onResolved && this.state === states.resolved) ||
        (!onRejected && this.state === states.rejected)) {
      promise2 = new Promise({}, this);
    }
    else {
      promise2 = new Promise();
      resolution = new Resolution(promise2);
      this.queue(states.resolved, resolution.chain(actions.resolve, onResolved || onRejected));
      this.queue(states.rejected, resolution.chain(actions.reject, onRejected || onResolved));
    }

    return promise2;
  };


  /**
   * Thenable resolution
   */
  function Resolution(promise) {
    this.promise = promise;
    this.resolved = 0;
  }

  // Promise.chain DRYs onresolved and onrejected operations.  Handler is onResolved or onRejected
  Resolution.prototype.chain = function (action, handler, then) {
    var _self = this;
    return function chain() {
      // Prevent calling chain multiple times
      if (!(_self.resolved)) {
        _self.resolved++;
        _self.context = this;
        _self.then    = then;

        try {
          _self.resolve(action, !handler ? arguments : [handler.apply(this, arguments)]);
        }
        catch (ex) {
          _self.promise.reject.call(_self.context, ex);
        }
      }
    };
  };

  // Routine to resolve a thenable.  Data is in the form of an arguments object (array)
  Resolution.prototype.resolve = function (action, data) {
    var input = data[0],
      then = (input && input.then),
      thenable = (then && typeof (then) === "function"),
      resolution, thenableType;

    // The resolver input must not be the promise tiself
    if (input === this.promise) {
      throw new TypeError();
    }

    if (thenable && then.constructor === Promise) {
      // Shortcut if the incoming spromise is already resolved
      resolution = new Resolution(this.promise);
      input.done(resolution.chain(actions.resolve)).fail(resolution.chain(actions.reject));
    }
    else {
      thenableType = (thenable && this.then !== input && typeof (input));
      if (thenableType === "function" || thenableType === "object") {
        try {
          resolution = new Resolution(this.promise, input);
          then.call(input, resolution.chain(actions.resolve, false, input), resolution.chain(actions.reject, false, input));
        }
        catch (ex) {
          if (!resolution.resolved) {
            this.promise.reject.call(this.context, ex);
          }
        }
      }
      else {
        this.promise[action].apply(this.context, data);
      }
    }
  };


  // Expose enums for the states
  Promise.states = states;
  return Promise;
});

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define('src/when',[
  "src/promise",
  "src/async"
], function(promise, async) {
  

  /**
  * Interface to allow multiple promises to be synchronized
  */
  function when( ) {
    // The input is the queue of items that need to be resolved.
    var queue    = Array.prototype.slice.call(arguments),
        promise1 = promise(),
        context  = this,
        i, item, remaining, queueLength;

    if ( !queue.length ) {
      return promise1.resolve(null);
    }

    //
    // Check everytime a new resolved promise occurs if we are done processing all
    // the dependent promises.  If they are all done, then resolve the when promise
    //
    function checkPending() {
      if ( remaining ) {
        remaining--;
      }

      if ( !remaining ) {
        promise1.resolve.apply(context, queueLength === 1 ? queue[0] : queue);
      }
    }

    // Wrap the resolution to keep track of the proper index in the closure
    function resolve( index ) {
      return function() {
        // We will replace the item in the queue with result to make
        // it easy to send all the data into the resolve interface.
        queue[index] = arguments;
        checkPending();
      };
    }

    function reject() {
      promise1.reject.apply(this, arguments);
    }

    function processQueue() {
      queueLength = remaining = queue.length;
      for ( i = 0; i < queueLength; i++ ) {
        item = queue[i];

        if ( item && typeof item.then === "function" ) {
          item.then(resolve(i), reject);
        }
        else {
          queue[i] = queueLength === 1 ? [item] : item;
          checkPending();
        }
      }
    }

    // Process the promises and callbacks
    async(processQueue);
    return promise1;
  }

  return when;
});


/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define('src/spromise',[
  "src/promise",
  "src/async",
  "src/when"
], function(promise, async, when) {
  promise.when = when;
  promise.async  = async;
  return promise;
});


define('src/resources',[
  "src/extender"
], function(extender) {
  


  /**
  * Resources!  This will allow the registration of resources so that they can
  * be exposed to directory hierarchy expected for resources.
  * If a resouce handler is registered, then resources will automatically look
  * for resources in the directory matching the name of the resource type.  This
  * is how MortarJS can automatically load tmpl resources from the tmpl directory.
  */

  var loaders = {};


  function resources (items, path) {
    return resources.load(items, path);
  }


  resources.register = function(type, loader) {
    if ( loader instanceof resources.resource === false ) {
      throw new TypeError("Resource loader must be of type resource");
    }

    loaders[type] = loader;
  };


  resources.fetch = function(resource, handler) {
    var resourceLoader = loaders[handler];

    // If the resource if a function, we will not handle process it as a resource
    if ( _.isFunction(resource) ) {
      return resource;
    }

    if (!handler || !resourceLoader) {
      return resource;
    }

    // Check for any hints of file extension.  If one does not exist, then infer it based on the handler.
    if ( resource.url && resource.url.lastIndexOf(".") === -1 ) {
      var ext = resourceLoader.extension;
      resource.url += ext ? "." + ext : "";
    }

    return resourceLoader.load(resource);
  };


  resources.load = function(items, fqn) {
    var resource, parts, config, directive, path, name;
    var result = {},
        pathParts = fqn ? fqn.split("/") : [];

    // Makes sure that we have a list of resources in a proper format
    items = resources.ensureResources(items);

    // Get the name from the fqn for resource name assignment
    name = pathParts.pop();

    // Skip intermmidiate directory because this is where I am expceting the resources to be located at based
    // on its handler name.  This is what gives me the ability to match resource loaders to directories
    pathParts.pop();

    // Setup root directory
    path = pathParts.join("/");

    for ( var handler in items ) {
      resource = items[handler];

      if ( !resource && resource !== "" ) {
        result[handler] = false;
        continue;
      }

      // Handle items with directives
      if ( /\w+!.*/.test(handler) ) {
        parts             = handler.split("!");
        handler           = parts[0];
        directive         = parts[1];
        config            = {};
        config[directive] = resource || path + "/" + handler + "/" + name;
        resource          = config;
      }

      resource.location = path + "/" + handler + "/" + name;
      result[handler] = resources.fetch(resource, handler);
    }

    return result;
  };


  resources.ensureResources = function( items ) {
    var result = {};
    var i, length;

    if ( items instanceof Array ) {
      for ( i = 0, length = items.length; i < length; i++ ) {
        result[ items[i] ] = "";
      }
    }
    else if (items) {
      result = items;
    }

    return result;
  };


  /**
  *  Resource interface to devire from when processing external resources
  */
  resources.resource = function() {};
  extender.mixin(resources.resource, {
    load: $.noop
  });


  return resources;
});

define('src/model',[
  "src/extender",
  "src/events",
  "src/spromise",
  "src/resources"
],function(extender, events, promise, resources) {
  


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
    return promise.when.call(this, this.datasource("post", data, options)).then(function(data){
      return data;
    });
  };


  // Read item from datasource
  crud.prototype.read = function(data, options) {
    return promise.when.call(this, this.datasource("get", data, options)).then(function(data) {
      this.serialize(data);
      return data;
    });
  };


  // Update item in the server
  crud.prototype.update = function(data, options) {
    return promise.when.call(this, this.datasource("put", data, options)).then(function(data){
      return data;
    });
  };


  // Delete item from the server
  crud.prototype.remove = function(data, options) {
    return promise.when.call(this, this.datasource("delete", data, options)).then(function(data){
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
    this.serialize(this.data);
    this._init();
    this._create();
  }



  // Assign request factory to model for direct access.  You can override
  // request or request.send in order to customize how data is transfered.
  model.datasource = datasource;


  extender.mixin(model, {
    ajax: {
      dataType: "json"
    },
    bind: $.noop,
    unbind: $.noop,
    _init: $.noop,
    _create: $.noop
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
    else if ( !options && (data || this.data) ) {
      data = data || this;

      // Items that can be used as options in a data object when an options object is
      // not explicitly provided.
      if ( data.data || data.url || data.events || data.datasource ) {
        options = _.extend({}, data);

        // Setup direct access to the data.  data.data could be undefined or null, which is
        // fine because the data and its type will be properly setup during serialization
        data = _.result(data, "data");
      }
    }

    // Ensure valid options object
    options = options || {};

    // Datasource to deal with data persistence
    options.datasource = options.datasource || model.datasource;

    // Ensure valid url, if one is provided
    if (_url) {
      options.url = _url;
    }

    if ( data ) {
      options.data = data;
    }

    var events = options.events || {};
    delete options.events;

    return {
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
  model.prototype.serialize = function(data) {
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


  // Expose as a resource.  Run it in a self executing function so keep the module clean
  // and so that we can also move the resource registration if need be.
  (function() {
    var resource = resources.resource.extend({
      load: model,
      extension: "js"
    });

    resources.register("model", new resource());
  })();

  return model;
});


define('src/fetch',[],function() {
  

  var cache = {};

  function fetch( settings ) {
    if ( !settings ) {
      throw "Invalid settings";
    }

    if ( typeof settings === "string" ) {
      settings = {
        url: settings
      };
    }

    // If the item is cached, we will just return that.
    if ( settings.url in cache === false || settings.refresh === true ) {
      var $ajax = _.extend({
        url: settings.url,
        cache: false
      }, settings.ajax);

      // Make request and add to the cache.
      cache[settings.url] = $.ajax($ajax);

      // If cache is disabled, we delete the item from the cache once the
      // resource is downloaded.  The reason we put it in the cache hash
      // even when cache is disabled is to transparently avoid sending
      // multiple requests to the server for the same resource while the
      // same request is pending.
      if ( settings.cache === false ) {
        cache[settings.url].always(function() {
          delete cache[settings.url];
        });
      }
    }

    return cache[settings.url];
  }


  fetch.get = function( url ) {
    return cache[url];
  };


  fetch.remove = function( url ) {
    if ( url in cache ) {
      delete cache[url];
    }
  };


  fetch.clear = function() {
    for ( var i in cache ) {
      delete cache[i];
    }
  };


  return fetch;
});


define('src/style',[
  "src/fetch",
  "src/spromise",
  "src/resources"
], function( fetch, promise, resources ) {
  


  function getType(name) {
    var offset = name.lastIndexOf(".");
    if ( offset !== -1 ) {
      return name.substr(offset + 1);
    }
  }


  function loader(url, dataType) {
    return fetch({
      "url": url,
      "ajax": {
        dataType: dataType
      }
    });
  }


  function style(options) {
    if (this instanceof style === false) {
      return new style(options);
    }

    var _promise = promise();
    options = options || {};

    if (typeof options.url === "string") {
      options.type = options.type || getType(options.url);
      var handler = style.handler[options.type];
      if (handler) {
        handler.load(options, _promise);
      }
    }
    else {
      _promise.reject("No suitable option");
    }

    return _promise;
  }


  style.handler = {
    "css": {
      dataType: "text",
      load: function(options, _promise){
        loader(options.url, "text").done(function(rc_style){
          $("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
          _promise.resolve( rc_style );
        });

        /*
        * Loading directly as a link...  Not really what we need from this
        */
        /*
        var head = document.getElementsByTagName('head')[0];
        var cssLink = document.createElement("link");
        cssLink.setAttribute("rel", "stylesheet");
        cssLink.setAttribute("type", "text/css");
        cssLink.setAttribute("href", options.url);
        head.appendChild(cssLink);
        _promise.resolve(cssLink);
        */
      }
    },
    "$css": {
      load: function(options, _promise) {
        loader(options.url, "json").done(function(rc_style){
          if( options.element instanceof jQuery ){
            options.element.css(rc_style);
          }
          _promise.resolve( rc_style );
        });
      }
    },
    "less": {
      load: function(options, _promise) {
        loader(options.url, "text").done(function(rc_style){
          //Process less content and then add it to the document as regular css
          //$("<style type='text/css'>" + rc_style + "</style>").appendTo('head');
          _promise.resolve( rc_style );
        });
      }
    }
  };


  // Expose as a resource.  Run it in a self executing function so keep the module clean
  // and so that we can also move the resource registration if need be.
  (function() {
    var resource = resources.resource.extend({
      load: style,
      extension: "css"
    });

    resources.register("style", new resource());
  })();

  return style;
});

define('src/tmpl',[
  "src/fetch",
  "src/spromise",
  "src/resources",
], function( fetch, promise , resources) {
  


  function tmpl(options, selector) {
    if ( this instanceof tmpl === false ) {
      return new tmpl(options, selector);
    }

    options = options || {};
    selector = selector || options.selector || tmpl.selector;

    var _promise = promise(),
        attrSelector = "[" + selector + "]";

    if (typeof options.url === "string" ) {
      tmpl.loader(options)
        .done(_promise.resolve)
        .fail(_promise.reject);
    }
    else if (typeof options.html === "string" ||
             options.html instanceof jQuery === true ) {
      _promise.resolve(options.html);
    }
    else {
      _promise.resolve(options);
    }

    // Handle nested tmpl loading
    return _promise.then(function(_tmpl) {
      var $tmpl = $(_tmpl);

      var done = $tmpl.filter(attrSelector)
        .add($tmpl.children(attrSelector))
        .add($tmpl.find(attrSelector))
        .map(function() {
          var $this = $(this);
          return tmpl({
              "url": $this.attr(selector)
            })
            .done(function(_tmpl){
              $this.append($(_tmpl));
            });
        });

      // If there is no nested
      if (!done.length) {
        return $tmpl;
      }

      return promise.when.apply(tmpl, done).then(function() {
        return $tmpl;
      });
    });
  }


  tmpl.selector = "mjs-tmpl";
  tmpl.loader = fetch;


  // Expose as a resource.  Run it in a self executing function so keep the module clean
  // and so that we can also move the resource registration if need be.
  (function() {
    var resource = resources.resource.extend({
      load: tmpl,
      extension: "html"
    });

    resources.register("tmpl", new resource());
  })();


  return tmpl;
});


define('src/view',[
  "src/extender",
  "src/events",
  "src/resources",
  "src/spromise"
], function(extender, events, resources, promise) {
  


  function loadResources(_self) {
    var resources = _self.resources || (_self.resources = {}),
        fqn       = _self.fqn,
        result    = baseview.resources(resources, fqn);
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
    if ( !result.tmpl && result.tmpl !== false ) {
      result.tmpl = _.result(_self, "tmpl") || (fqn && baseview.resources(["tmpl!url"], fqn).tmpl);
    }

    if ( !result.style && _self.style ) {
      result.style = _.result(_self, "style");
    }

    if ( !result.model && _self.model ) {
      result.model = _.result(_self, "model");
    }

    promises = _.map(result, function( value, key ) {
      promise.when(value).done(function(val) {
        _self[key] = val;

        // Immediately try to resolve resources that may have been defined as a function.
        _self[key] = _.result(_self, key);
      });
      return value;
    });

    return promise.when.apply(_self, promises);
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
    for ( var resource in resources ) {
      if ( resources.hasOwnProperty( resource ) && _.isFunction(resources[resource].loaded) ) {
        resources[resource].loaded.call(_self[resource], _self);
      }
    }
  }


  /**
  * baseview
  */
  function baseview(options) {
    var _self  = this,
      deferred = promise(),
      settings = baseview.configure.apply(_self, arguments);

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


define('src/mortar',[
  "src/extender",
  "src/events",
  "src/hash.route",
  "src/model",
  "src/fetch",
  "src/style",
  "src/tmpl",
  "src/view",
  "src/resources",
  "src/spromise"
], function(extender, events, hash, model, fetch, style, tmpl, view, resources, promise) {

  return {
    extender: extender,
    events: events,
    hash: hash,
    model: model,
    fetch: fetch,
    style: style,
    tmpl: tmpl,
    view: view,
    resources: resources,
    promise: promise
  };

});

  return require('src/mortar');
}));
