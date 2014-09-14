/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * https://github.com/MiguelCastillo/spromise
 */


/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define( 'src/async',[],function() {
  var _self = this;

  var nextTick;
  if ( _self.setImmediate ) {
    nextTick = _self.setImmediate;
  }
  else if ( _self.process && typeof _self.process.nextTick === "function" ) {
    nextTick = _self.process.nextTick;
  }
  else {
    nextTick = function(cb) {
      _self.setTimeout(cb, 0);
    };
  }

  return nextTick;
});

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define('src/promise',[
  "src/async"
], function (Async) {
  

  var states = {
    "pending": 0,
    "always": 1,
    "resolved": 2,
    "rejected": 3,
    "notify": 4
  };

  var strStates = [
    "pending",
    "",
    "resolved",
    "rejected",
    ""
  ];


  /**
   * Small Promise
   */
  function Promise(resolver, options) {
    if (this instanceof Promise === false) {
      return new Promise(resolver, options);
    }

    var target       = this;
    var stateManager = new StateManager(options || {});

    /**
     * callback registration (then, done, fail, always) must be synchrounous so
     * that the callbacks can be registered in the order they come in.
     */

    function then(onResolved, onRejected) {
      return stateManager.then(onResolved, onRejected);
    }

    // Setup a way to verify an spromise object
    then.constructor  = Promise;
    then.stateManager = stateManager;

    function done(cb) {
      stateManager.enqueue(states.resolved, cb);
      return target.promise;
    }

    function fail(cb) {
      stateManager.enqueue(states.rejected, cb);
      return target.promise;
    }

    function always(cb) {
      stateManager.enqueue(states.always, cb);
      return target.promise;
    }

    function notify(cb) {
      stateManager.enqueue(states.notify, cb);
      return target.promise;
    }

    function state() {
      return strStates[stateManager.state];
    }

    function resolve() {
      stateManager.transition(states.resolved, this, arguments);
      return target;
    }

    function reject() {
      stateManager.transition(states.rejected, this, arguments);
      return target;
    }

    target.always = always;
    target.done = done;
    target.catch = fail;
    target.fail = fail;
    target.notify = notify;
    target.resolve = resolve;
    target.reject = reject;
    target.then = then;
    target.state = state;
    target.promise = {
      always: always,
      done: done,
      catch: fail,
      fail: fail,
      notify: notify,
      then: then,
      state: state
    };

    // Interface to allow to post pone calling the resolver as long as its not needed
    if (typeof (resolver) === "function") {
      resolver.call(target, target.resolve, target.reject);
    }
  }

  /**
   * Interface to play nice with libraries like when and q.
   */
  Promise.defer = function () {
    return new Promise();
  };

  /**
   * Interface to create a promise and link it to a thenable object.  The assumption is that
   * the object passed in is a thenable.  If it isn't, there is no check so an exption might
   * be going your way.
   */
  Promise.thenable = function (thenable) {
    return new Promise(thenable.then);
  };

  /**
   * Create a promise that's already rejected
   */
  Promise.reject = Promise.rejected = function () {
    return new Promise(null, {
      context: this,
      value: arguments,
      state: states.rejected
    });
  };

  /**
   * Create a promise that's already resolved
   */
  Promise.resolve = Promise.resolved = function () {
    return new Promise(null, {
      context: this,
      value: arguments,
      state: states.resolved
    });
  };


  /**
   * StateManager is the state manager for a promise
   */
  function StateManager(options) {
    // Initial state is pending
    this.state = states.pending;

    // If a state is passed in, then we go ahead and initialize the state manager with it
    if (options.state) {
      this.transition(options.state, options.context, options.value);
    }
  }

  // Queue will figure out if the promise is pending/resolved/rejected and do the appropriate
  // action with the callback based on that.
  StateManager.prototype.enqueue = function (state, cb, sync) {
    var _self = this,
      _state  = _self.state;

    if (!_state) {
      (this.queue || (this.queue = [])).push({
        state: state,
        cb: cb
      });
    }

    // If resolved, then lets try to execute the queue
    else if (_state === state || states.always === state) {
      if (sync) {
        cb.apply(_self.context, _self.value);
      }
      else {
        Async(function queuecb() {
          cb.apply(_self.context, _self.value);
        });
      }
    }

    // Do proper notify events
    else if (states.notify === state) {
      if (sync) {
        cb.call(_self.context, _self.state, _self.value);
      }
      else {
        Async(function queuecb() {
          cb.call(_self.context, _self.state, _self.value);
        });
      }
    }
  };

  // Sets the state of the promise and call the callbacks as appropriate
  StateManager.prototype.transition = function (state, context, value, sync) {
    if (this.state) {
      return;
    }

    this.state   = state;
    this.context = context;
    this.value   = value;

    // Process queue if anything is waiting to be notified
    if (this.queue) {
      var queue = this.queue,
        length = queue.length,
        i = 0,
        item;

      this.queue = null;

      for (; i < length; i++) {
        item = queue[i];
        this.enqueue(item.state, item.cb, sync);
      }
    }
  };

  // Links together the resolution of promise1 to promise2
  StateManager.prototype.then = function (onResolved, onRejected) {
    var resolution;
    onResolved = typeof (onResolved) === "function" ? onResolved : null;
    onRejected = typeof (onRejected) === "function" ? onRejected : null;

    if ((!onResolved && this.state === states.resolved) ||
        (!onRejected && this.state === states.rejected)) {
      return new Promise(null, this);
    }

    resolution = new Resolution(new Promise());
    this.enqueue(states.notify, resolution.notify(onResolved, onRejected));
    return resolution.promise;
  };


  /**
   * Thenable resolution
   */
  function Resolution(promise) {
    this.promise = promise;
  }

  // Notify when a promise has change state.
  Resolution.prototype.notify = function (onResolved, onRejected) {
    var _self = this;
    return function notify(state, value) {
      var handler = (onResolved || onRejected) && (state === states.resolved ? (onResolved || onRejected) : (onRejected || onResolved));
      try {
        _self.context = this;
        _self.finalize(state, handler ? [handler.apply(this, value)] : value);
      }
      catch (ex) {
        _self.promise.reject.call(_self.context, ex);
      }
    };
  };

  // Promise.chain DRYs onresolved and onrejected operations.  Handler is onResolved or onRejected
  // This chain is partcularly used when dealing with external promises where we just just have to
  // resolve the result
  Resolution.prototype.chain = function (state) {
    var _self = this;
    return function resolve() {
      try {
        // Handler can only be called once!
        if ( !_self.resolved ) {
          _self.resolved = true;
          _self.context  = this;
          _self.finalize(state, arguments);
        }
      }
      catch (ex) {
        _self.promise.reject.call(_self.context, ex);
      }
    };
  };

  // Routine to resolve a thenable.  Data is in the form of an arguments object (array)
  Resolution.prototype.finalize = function (state, data) {
    var input = data[0],
      then    = (input && input.then),
      promise = this.promise,
      context = this.context,
      resolution, thenableType;

    // 2.3.1
    if (input === this.promise) {
      throw new TypeError("Resolution input must not be the promise being resolved");
    }

    // 2.3.2
    // Shortcut if the incoming promise is an instance of spromise
    if (then && then.constructor === Promise) {
      then.stateManager.enqueue(states.notify, this.notify(), true);
      return;
    }

    // 2.3.3
    // If thenable is function or object, then try to resolve using that.
    thenableType = then && (typeof (then) === "function" && typeof (input));
    if (thenableType === "function" || thenableType === "object") {
      try {
        resolution = new Resolution(promise);
        then.call(input, resolution.chain(states.resolved), resolution.chain(states.rejected));
      }
      catch (ex) {
        if (!resolution.resolved) {
          promise.reject.call(context, ex);
        }
      }
    }

    // 2.3.4
    // Just resolve the promise
    else {
      promise.then.stateManager.transition(state, context, data, true);
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


define('src/all',[
  "src/promise",
  "src/async"
], function(Promise, Async) {
  

  function _result(input, args, context) {
    if (typeof(input) === "function") {
      return input.apply(context, args||[]);
    }
    return input;
  }

  function All(values) {
    values = values || [];

    // The input is the queue of items that need to be resolved.
    var resolutions = [],
        promise     = Promise.defer(),
        context     = this,
        remaining   = values.length;

    if (!values.length) {
      return promise.resolve(values);
    }

    // Check everytime a new resolved promise occurs if we are done processing all
    // the dependent promises.  If they are all done, then resolve the when promise
    function checkPending() {
      remaining--;
      if (!remaining) {
        promise.resolve.call(context, resolutions);
      }
    }

    // Wrap the resolution to keep track of the proper index in the closure
    function resolve(index) {
      return function() {
        resolutions[index] = arguments.length === 1 ? arguments[0] : arguments;
        checkPending();
      };
    }

    function processQueue() {
      var i, item, length;
      for (i = 0, length = remaining; i < length; i++) {
        item = values[i];
        if (item && typeof item.then === "function") {
          item.then(resolve(i), promise.reject);
        }
        else {
          resolutions[i] = _result(item);
          checkPending();
        }
      }
    }

    // Process the promises and callbacks
    Async(processQueue);
    return promise;
  }

  return All;
});


/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define('src/when',[
  "src/promise",
  "src/all"
], function(Promise, All) {
  

  /**
  * Interface to allow multiple promises to be synchronized
  */
  function When() {
    var context = this, args = arguments;
    return Promise(function(resolve, reject) {
      All.call(context, args).then(function(results) {
        resolve.apply(context, results);
      },
      function(reason) {
        reject.call(context, reason);
      });
    });
  }

  return When;
});


/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define('src/spromise',[
  "src/promise",
  "src/async",
  "src/when",
  "src/all"
], function(promise, async, when, all) {
  promise.async  = async;
  promise.when = when;
  promise.all = all;
  return promise;
});
