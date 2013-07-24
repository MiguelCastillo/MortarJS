define(function(require, exports, modules) {

  var view = require("mortar/view");

  view("mortar.main", {
    options: {
      "style": true,
      "model": {
        "data": {
          "say": 'Hello World'
        }
      }
    },

    _create: function() {
    },

    _destroy: function() {
    }
  });


  $(function(){
    $("<div class='main-container'>").main().appendTo('body');
  });

});
