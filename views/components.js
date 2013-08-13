define(function(require, exports, module) {

  var view = require("mortar/view");
  require("bootstrap");
  require("codemirror/lib/codemirror");
  require("codemirror/mode/javascript/javascript");
  require("codemirror/addon/runmode/runmode");
  require("codemirror/addon/runmode/colorize");


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


    $(".jscode", widget.element).each(function( index, item ) {
      var $target = $("<pre class='cm-s-default'>").appendTo(item);
      var $source = $("textarea", item);
      CodeMirror.runMode($source[0].value, "application/javascript", $target[0]);
    });
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
