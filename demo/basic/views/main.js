<<<<<<< HEAD
define(function(require, exports, modules) {

  var view = require("mortar/view");

  view("mortar.main", {
    options: {
      "style": true,
=======
//
// Require js module definition
//
define(function(require, exports, modules) {

  // Load mortar view
  var view = require("mortar/view");

  // Register a view in the factory
  // When registering a view, a css and fragment will be automatically loaded
  // with the macthing name of the widget, unless they are set to false.
  view("mortar.main", {
    options: {
>>>>>>> gh-pages
      "model": {
        "data": {
          "say": 'Hello World'
        }
      }
    },

    _create: function() {
    },

    _destroy: function() {
    }
  });


<<<<<<< HEAD
  $(function(){
    $("<div class='main-container'>").main().appendTo('body');
=======
  // When document is ready, instantiate main.
  $(function(){
    $('body').main();
>>>>>>> gh-pages
  });

});
