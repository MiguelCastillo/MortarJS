define(function(require, exports, module) {

  var view = require("mortar/view");
  require("codemirror/lib/codemirror");
  require("codemirror/mode/javascript/javascript");
  require("codemirror/addon/runmode/runmode");
  require("codemirror/addon/runmode/colorize");


  function create() {
    var _view = this;

    // side bar
    setTimeout(function () {
      $(".nav-list", _view.$el).affix({
        offset: {
          top: function () { return $(window).width() <= 980 ? 290 : 220; },
          bottom: 270
        }
      });
    }, 100);

    loadCode(_view.$el);
  }


  function loadCode(target) {
    $(".jscode, .csscode", target).each(function( index, item ) {
      var $source = $("textarea", item);
      $source.each(function(index, textarea) {
        var $target = $("<pre class='cm-s-monokai'>").appendTo(item);
        CodeMirror.runMode(textarea.value, "application/javascript", $target[0]);
      });
    });
  }


  return view.extend({
    path: "components/views/components",
    resources: {
      "tmpl": "url!",
      "style": "url!"
    },
    events: {
      "view:ready": create
    }
  });

});
