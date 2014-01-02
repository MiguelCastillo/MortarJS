define(function(require, exports, module) {

  var home = require("home/views/home");

  return function(options) {
    var _home = new home(options);
    return _home;
  }
});
