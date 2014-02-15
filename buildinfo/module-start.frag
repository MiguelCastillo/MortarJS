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

