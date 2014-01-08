(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // Do AMD support
    define(factory);
  } else {
    // Do browser support
    root.mortar = factory();
  }
}(this, function () {
  //almond, and your modules will be inlined here

