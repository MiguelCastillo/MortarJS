define(function(require, exports, modules) {

  var view = require("mortar/view");
  require("views/mainheader");


  function init(widget) {
    widget.element.find(".mainheaderContainer").mainheader();
  }


  view("doc.maincontent", {
    options: {
    },

    _create: function() {
      init(this);
    },

    _destroy: function() {
    }
  });

});
