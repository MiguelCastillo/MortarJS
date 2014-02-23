/**
 * rjasmine Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * https://github.com/MiguelCastillo/rjasmine
 */

/**
 * jasmine expansion to provide AMD support.
 */
define([
  "jasmine",
  "src/boot",
  "src/extender",
  "src/timer",
  "src/reporters",
  "src/spromise"
], function(jasmine, boot, extender, timer, reporters, promise) {
  "use strict";


  function rjasmine( options ) {
    options = options || {};

    // Call boot to get jasmine stuff all setup.
    var _boot = new boot(options);

    // Init reporters
    var ready = reporters(this, options.reporters);

    // Extend the instance to include important bits from jasmine
    rjasmine.extend(this, _boot.api, {
      _api: _boot.api,
      _core: _boot.core,
      _env: _boot.env,
      _reporter: _boot.reporter,
      execute: _boot.env.execute,
      extend: rjasmine.extend,
      jasmine: jasmine,
      ready: ready.done
    });
  }


  /**
   * Exposes important bits that users might want to consume directly
   */
  rjasmine.extend    = extender;
  rjasmine.timer     = timer;
  rjasmine.jasmine   = jasmine;
  rjasmine.reporters = reporters;
  rjasmine.promise   = promise;
  return rjasmine;

});
