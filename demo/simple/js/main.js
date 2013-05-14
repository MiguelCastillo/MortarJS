define(function(require, exports, modules) {

  require("mortar/fragment"), require("mortar/model"), require("mortar/style");
  var widget = require("mortar/widget");

  widget("mortar.main", {
    options: {
      'fragment': {
        'url': 'js/main.html'
      },
      'style': {
        'url': 'js/main.css',
        'type': 'css'
      },
      'model': {
        'data': {
          'say': 'Hello World'
        }
      }
    },

    _create: function() {
      this.element.addClass(this.widgetName);
    },
    
    _destroy: function() {
    }
  });


  $(function(){
    $("<div class='main-container'>").main().appendTo('body');
  });

});
