define(function(require, exports, modules) {

  require("mortar/fragment"), require("mortar/style");
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
          'hello': 'world'
        }
      }
    },

    _create: function() {
    },
    
    _destroy: function() {
    }
  });


  $(document).ready(function(){
    $('body').main();
  });

});
