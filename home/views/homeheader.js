define(function(require, exports, modules) {

  var view = require("mortar/view");


  function create() {
  }


  function destroy() {
  }


  return view.extend({
    path: "home/views/homeheader",
    resources: {
      tmpl: "url!",
      style: "url!"
    },
    _create: create,
    _destroy: destroy
  });

});
