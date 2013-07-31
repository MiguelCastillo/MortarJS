define(function(require, exports, module) {

  var view = require("mortar/view");
  //view.register("components", "./components");
  //view.register("examples", "./examples");
  require("views/navbar");
  require("views/home");
  require("views/components");
  require("views/examples");


  function viewManager(widget) {
    var currentView = false;

    return {
      switchView: function(newView) {
        if ( currentView !== false ) {
          widget.element.find(".maincontentContainer")[currentView]("destroy").empty();
        }

        widget.element.find(".maincontentContainer")[newView]();
        currentView = newView;
      }
    };
  }


  function init(widget) {
    var _viewManager = viewManager(widget);

    widget.element
      .on("click", "a[href=#home]", function(evt) {
        _viewManager.switchView("home");
      })
      .on("click", "a[href=#components]", function(evt) {
        _viewManager.switchView("components");
      })
      .on("click", "a[href=#examples]", function(evt) {
        _viewManager.switchView("examples");
      });

    widget.element.find(".navbarContainer").navbar();
    _viewManager.switchView("home");
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

