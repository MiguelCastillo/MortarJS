define(function(require, exports, modules) {

  require("mortar/fragment"), require("mortar/model");
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
    },
    
    _destroy: function() {
    }
  });


  $(function(){
    $('body').main();
  });

});
