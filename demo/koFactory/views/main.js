define(function(require, exports, modules) {

  require("mortar/fragment"), require("mortar/model"), require("mortar/style"), koFactory = require("mortar/ko.factory");
  var widget = require("mortar/widget");

  var model = koFactory.fromJS({
    "integer": 1,
    "ninteger": -2,
    "float": 1.1,
    "nfloat": -1.2,
    "string": "Bad Whether",
    "object": {
      "name": {
        "first": "John",
        "last": "Dough"
      }
    },
    "arrayInteger": [000, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    "arrayFloat": [000, 100 / 3.14, 200 / 3.14, 300 / 3.14, 400 / 3.14, 500 / 3.14, 600 / 3.14, 700 / 3.14, 800 / 3.14, 900 / 3.14]
  });


  widget("mortar.main", {
    options: {
      "fragment": {
        "url": "views/main.html"
      },
      "style": {
        "url": "views/main.css",
        "type": "css"
      },
      "model": model
    },

    _create: function() {
      this.element.addClass(this.widgetName);

      var count = 0;
      setInterval(function() {
        if ( count++ < 10 ) {
          model.arrayFloat.push( koFactory.fromJS( (Math.random() / 3.14) * 11 ) );
          model.arrayInteger.push( koFactory.fromJS( Math.floor(Math.random() * 11) ) );
        }
        else {
          model.arrayFloat.removeAll();
          model.arrayInteger.removeAll();
          count = 0;
        }
      }, 3000);

    },

    _destroy: function() {
    }
  });


  $(function(){
    $("<div class='main-container'>").main().appendTo('body');
  });

});
