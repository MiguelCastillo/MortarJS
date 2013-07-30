define(function(require, exports, modules) {

  var view = require("mortar/view");


  function init(widget) {
  }


  view("doc.maincontent", {
    options: {
    },

    _create: function() {
      this.element.addClass("container");
      init(this);
    },

    _destroy: function() {
    }
  });

});
