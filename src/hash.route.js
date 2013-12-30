/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 *
 * https://github.com/MiguelCastillo/hash.route.js
 */


define(["jquery"], function( $ ) {
  "use strict";

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
  hash.enable = function(val) {
    if ( enabled ) {
      return;
    }

    enabled = true;

    if ( "onhashchange" in self ) {
      $(self).on("hashchange", throttlechange);
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

    if ( "onhashchange" in self ) {
      $(self).off("hashchange", throttlechange);
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

      var matches = matchUri(uri),
          lastMatch = "",
          lastUrl = "";

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
    function onEvent(evt, selector, callback) {
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
  };


  hash.patternMatch = patternMatch;
  hash.route = route;


  // Let's start things enabled
  hash.enable(true);
  return hash;
});

