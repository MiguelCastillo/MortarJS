define(function(require, exports, module) {

  var view = require("mortar/view");
  require("views/navbar");


  function init(widget) {
    widget.element.find(".navbarContainer").navbar();
  }


  view("docs.main", {
    options: {
      "style": true
    },

    _create: function() {
      init(this);
    },

    _destroy: function() {

    }
  });


  // Init main when document is ready
  $(function() {
    $("body").main();
  });

});

