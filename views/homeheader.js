define(function(require, exports, modules) {

  var view = require("mortar/view");

  function init( widget ) {
  }

  view("docs.homeheader", {
    options: {
    },

    _create: function() {
      this.element.addClass("hero-unit");
      init(this);
    },

    _destroy: function() {
    }
  });

});
