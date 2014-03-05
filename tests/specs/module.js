define(["src/module"], function(Module) {

  describe("Module", function() {

    it("require simpleObject", function() {
      //Module.settings.baseUrl = "http://mcastillo/test/machine";
      //Module.require("../my/filename");

      return Module.require("tests/js/simpleObject").done(function(result) {
        console.log(result);
      });
    });

    it("require multipleDefine", function() {
      return Module.require("tests/js/multipleDefine").done(function(result) {
        console.log(result);
      });
    });


    it("require simpleWithGlobal", function() {
      return Module.require("tests/js/simpleWithGlobal").done(function(result) {
        console.log(result);
      });
    });


    it("require dependencies", function() {
      return Module.require("tests/js/dependencies").done(function(result) {
        console.log(result);
      });
    });


    it("require namedModuleObject", function() {
      return Module.require("tests/js/namedModuleObject").done(function(result) {
        console.log(result);
      });
    });


    it("require namedModuleFunction", function() {
      return Module.require("tests/js/namedModuleFunction").done(function(result) {
        console.log(result);
      });
    });


    it("require spromise", function() {
      return Module.require("src/spromise").done(function(module) {
        console.log("=====> spromise", module);
      });
    });


    it("require fetch", function() {
      return Module.require("src/fetch").done(function(module) {
        console.log("=====> fetch", module);
      });
    });


    it("require style", function() {
      Module.require("src/style").done(function(style) {
        console.log("=====> style", style);
      });
    });


    it("require view", function() {
      Module.require("src/view").done(function(view) {
        console.log("=====> view", view);
      });
    });

  });
});
