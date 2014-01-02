define(function(require, exports, module) {

  var view = require("mortar/view");
  var homeheader = require("home/views/homeheader");


  function create() {
    var _view = this;
    this.homeheader = new homeheader($(".header", _view.$el));
  }


  function destroy() {
  }


  return view.extend({
    path: "home/views/home",
    resources: {
      tmpl: "url!"
    },
    _create: create,
    _destroy: destroy
  });

});
