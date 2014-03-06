define(["src/module"], function(Module) {

  describe("Module", function() {

    it("require simpleObject", function() {
      return Module.import("tests/js/simpleObject").done(function(result) {
        console.log(result);
      });
    });

    it("require multipleDefine", function() {
      return Module.import("tests/js/multipleDefine").done(function(result) {
        console.log(result);
      });
    });


    it("require simpleWithGlobal", function() {
      return Module.import("tests/js/simpleWithGlobal").done(function(result) {
        console.log(result);
      });
    });


    it("require dependencies", function() {
      return Module.import("tests/js/dependencies").done(function(result) {
        console.log(result);
      });
    });


    it("require namedModuleObject", function() {
      return Module.import("tests/js/namedModuleObject").done(function(result) {
        console.log(result);
      });
    });


    it("require namedModuleFunction", function() {
      return Module.import("tests/js/namedModuleFunction").done(function(result) {
        console.log(result);
      });
    });


//    it("require circular dependency", function() {
//      return Module.import("tests/js/circularDependencyA").done(function(result) {
//        console.log(result);
//      });
//    });


    it("require CJSsimpleObject", function() {
      return Module.import("tests/js/CJSsimpleObject").done(function(result) {
        console.log("=====> CJSsimpleObject", result);
      });
    });


    it("require spromise", function() {
      return Module.import("src/spromise").done(function(module) {
        console.log("=====> spromise", module);
      });
    });


    it("require fetch", function() {
      return Module.import("src/fetch").done(function(module) {
        console.log("=====> fetch", module);
      });
    });


    it("require style", function() {
      return Module.import("src/style").done(function(style) {
        console.log("=====> style", style);
      });
    });


    it("require view", function() {
      return Module.import("src/view").done(function(view) {
        console.log("=====> view", view);
      });
    });

  });
});
