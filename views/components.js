define(function(require, exports, module) {

  var view = require("mortar/view");
  require("bootstrap");


  function init( widget ) {
    // side bar
    setTimeout(function () {
      $(".nav-list", widget.element).affix({
        offset: {
          top: function () { return $(window).width() <= 980 ? 290 : 220; }
        , bottom: 270
        }
      });
    }, 100);

  }


  view("docs.components", {
    options: {
    },

    _create: function() {
      init( this );
    },

    _destroy: function() {
    }

  });

});
