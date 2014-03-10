
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
  function Async( ) {
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
    args = arguments[index] || [];

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

  return Async;
});

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define('src/promise',["src/async"], function (Async) {
  

  var states = {
    "pending": 0,
    "resolved": 2,
    "rejected": 3
  };

  var queues = {
    "always": 1,
    "resolved": 2,
    "rejected": 3
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
      return target.promise;
    }

    function fail(cb) {
      stateManager.queue(states.rejected, cb);
      return target.promise;
    }

    function always(cb) {
      stateManager.queue(queues.always, cb);
      return target.promise;
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
  * Interface to create a promise from a resolve function that is called with
  * a resolve and reject as the only parameters to it
  */
  Promise.factory = function(resolver) {
    if ( typeof resolver !== "function" ) {
      throw new TypeError("Resolver must be a function");
    }

    var promise = new Promise();
    resolver(promise.resolve, promise.reject);
    return promise.promise;
  };


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
    else if (this.state === state || state === 1) {
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
      this.async   = Async.call(context, false, (void 0), value);
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
], function(Promise, Async) {
  

  /**
  * Interface to allow multiple promises to be synchronized
  */
  function When( ) {
    // The input is the queue of items that need to be resolved.
    var queue    = Array.prototype.slice.call(arguments),
        promise  = Promise.defer(),
        context  = this,
        i, item, remaining, queueLength;

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
        promise.resolve.apply(context, queue);
      }
    }

    // Wrap the resolution to keep track of the proper index in the closure
    function resolve( index ) {
      return function() {
        // We will replace the item in the queue with result to make
        // it easy to send all the data into the resolve interface.
        queue[index] = arguments.length === 1 ? arguments[0] : arguments;
        checkPending();
      };
    }

    function reject() {
      promise.reject.apply(this, arguments);
    }

    function processQueue() {
      queueLength = remaining = queue.length;
      for ( i = 0; i < queueLength; i++ ) {
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

    // Process the promises and callbacks
    Async(processQueue);
    return promise;
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
  "src/when"
], function(promise, async, when) {
  promise.when = when;
  promise.async  = async;
  return promise;
});

