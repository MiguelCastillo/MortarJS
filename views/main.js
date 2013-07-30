define(function(require, exports, module) {

  var view = require("mortar/view");
  require("views/navbar");
  require("views/mainheader");
  require("views/maincontent");


  function init(widget) {
    widget.element.find(".navbarContainer").navbar();
    widget.element.find(".mainheaderContainer").mainheader();
    widget.element.find(".maincontentContainer").maincontent();
  }


  view("docs.main", {
    options: {
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

