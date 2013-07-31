define(function(require, exports, modules) {

  var view = require("mortar/view");
  require("views/homeheader");


  function init(widget) {
    widget.element.find(".homeheaderContainer").homeheader();
  }


  view("docs.home", {
    options: {
    },

    _create: function() {
      init(this);
    },

    _destroy: function() {
    }
  });

});
