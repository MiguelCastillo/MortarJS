/**
 * scpromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */


define( function() {

  /**
  * Handle exceptions in a setTimeout.
  * @func <function> to be called when timeout finds cycles to execute it
  * @err  <function> to be called when there is an exception thrown.  If
  *  no function is provided then the exception will be rethrown outside
  *  of the setTimeout scope
  */
  function async( ) {
    var args     = Array.prototype.slice.call(arguments),
        func     = args.shift(),
        context  = this,
        error    = function(){};


    function runner() {
      return function() {
        try {
          func.apply(context, args[0]);
        }
        catch( ex ) {
          setTimeout(thrown(ex), 1);
        }
      };
    }

    function thrown(err) {
      return function() {
        error(err);
      };
    }

    function fail(cb) {
      error = cb;
    }

    // Schedule for running...
    setTimeout(runner(), 1);

    return {
      fail: fail
    };
  }


  return async;

});
