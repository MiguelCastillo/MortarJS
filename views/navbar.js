define(function(require, exports, modules) {

  var view = require("mortar/view");

  function init(widget) {
  }

  view("docs.navbar", {
    options: {
    },

    _create: function() {
      this.element.addClass("navbar-inverse navbar-fixed-top");
      init(this);
    },

    _destroy: function() {
    }
  });

});
