/**
 * scpromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * Simple Compliant Promise
 * https://github.com/MiguelCastillo/scpromise
 */


define([
  "mortar/extender"
], function(extender) {
  "use strict";

  var states = {
    "pending": 0,
    "resolved": 1,
    "rejected": 2
  };


  var actions = {
    resolve: "resolve",
    reject: "reject"
  };


  var queues = {
    always: "always",
    resolved: "resolved",
    rejected: "rejected"
  };


  function scpromise( target ) {
    target = target || {}; // Make sure we have a target object
    var _state  = states.pending, // Current state
        _queues = {
          always: [],             // Always list of callbacks
          resolved: [],           // Success list of callbacks
          rejected: []            // Failue list of callbacks
        }, _value;                // Resolved/Rejected value.


    // Then promise interface
    function then( onFulfilled, onRejected ) {
      // Create a new promise to properly create a promise chain
      var promise = new scpromise();

      setTimeout(function() {
        try {
          // Handle done callback
          target.done(function() {
            _thenResolver( promise, actions.resolve, onFulfilled, arguments );
          });

          // Handle fail callback
          target.fail(function() {
            _thenResolver( promise, actions.reject, onRejected, arguments );
          });
        }
        catch( ex ) {
          promise.reject(ex);
        }
      }, 1);

      return promise;
    }


    function done( cb ) {
      if ( isRejected() ) {
        return target;
      }

      _queue( queues.resolved, cb );
      return target;
    }


    function fail( cb ) {
      if ( isResolved() ) {
        return target;
      }

      _queue( queues.rejected, cb );
      return target;
    }


    function resolve( ) {
      if ( !isPending() ) {
        throw "Promise is already resolved";
      }

      _updateState( states.resolved, Array.prototype.slice.call(arguments) );
      return target;
    }


    function reject( ) {
      if ( !isPending() ) {
        throw "Promise is already resolved";
      }

      _updateState( states.rejected, Array.prototype.slice.call(arguments) );
      return target;
    }


    function always( cb ) {
      _queue( queues.always, cb );
      return target;
    }


    function state() {
      return _state;
    }


    function isResolved() {
      return _state === states.resolved;
    }


    function isRejected() {
      return _state === states.rejected;
    }


    function isPending() {
      return _state === states.pending;
    }


    return extender.mixin(target, {
      always: always,
      done: done,
      fail: fail,
      resolve: resolve,
      reject: reject,
      then: then,
      state: state,
      isResolved: isResolved,
      isRejected: isRejected,
      isPending: isPending
    });


    /**
    * Internal core functionality
    */

    // Queue will figure out if the promise is resolved/rejected and do something
    // with the callback based on that.  It also verifies that there is a callback
    // function
    function _queue( type, cb ) {
      if ( typeof cb !== "function" ) {
        throw "Callback must be a valid function";
      }

      // If the promise is already resolved/rejected, we call the callback right away
      if ( isPending() ) {
        _queues[type].push(cb);
      }
      else if((queues.resolved === type && isResolved()) ||
              (queues.rejected === type && isRejected())) {
        cb.apply(_value[0], _value);
      }
    }


    // Tell everyone and tell them we are resolved/rejected
    function _notify( queue ) {
      var i, length;
      for ( i = 0, length = queue.length; i < length; i++ ) {
        queue[i].apply(_value[0], _value);
      }

      // Empty out the array
      queue.splice(0, queue.length);
    }


    // Sets the state of the promise and call the callbacks as appropriate
    function _updateState( state, value ) {
      _state = state;
      _value = value;
      _notify( _queues[state === states.resolved ? queues.resolved : queues.rejected] );
      _notify( _queues[queues.always] );
    }


    // Routine to resolve a thenable
    function _thenResolver( promise, action, handler, data ) {
      var result = (handler && handler.apply(data[0], data)) || data;

      // Handle thenable chains
      if ( handler && result && typeof result.then === "function" ) {
        // Make sure we set the data as the context for then
        result.then.call( data[0], function() {
          promise.resolve.apply( arguments, arguments );
        }, function () {
          promise.reject.apply( arguments, arguments );
        });
      }
      // Handle direct callbacks
      else {
        result = (result && [result]);
        promise[action].apply( result, result );
      }
    }
  }


  /**
  * Interface to allow multiple promises to be synchronized
  */
  scpromise.when = function( ) {
    // The input is the queue of items that need to be resolved.
    var queue   = Array.prototype.slice.call(arguments).slice(0),
        promise = new scpromise(),
        i, length, item, remaining;

    if ( !queue.length ) {
      return promise.resolve(null);
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
        promise.resolve.apply(queue, queue);
      }
    }

    // Wrap the resolution to keep track of the proper index in the closure
    function resolve( index ) {
      return function(result) {
        // We will replace the item in the queue with result to make
        // it easy to send all the data into the resolve interface
        queue[index] = result;
        checkPending();
      };
    }

    function reject() {
      promise.reject.apply(arguments, arguments);
    }

    function processQueue() {
      try {
        for ( i = 0, length = queue.length, remaining = queue.length; i < length; i++ ) {
          item = queue[i];

          if ( item && typeof item.then === "function" ) {
            item.then(resolve(i), reject);
          }
          else {
            queue[i] = item;
            checkPending();
          }
        }
      }
      catch( ex ) {
        reject(ex);
      }
    }

    // Process the promises and callbacks
    setTimeout(processQueue, 1);
    return promise;
  };


  return scpromise;
});
