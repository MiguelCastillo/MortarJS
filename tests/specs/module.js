var global = this;

define(["src/module"], function(Module) {

  describe("Module", function() {

    it("require rawModule", function() {
      return Module.import("tests/js/rawModule").done(function(result) {
        expect(typeof result.init).toBe("function");
        expect(result.hello).toBe("world");
      });
    });


    it("require rawModuleNoReturn", function() {
      return Module.import("tests/js/rawModuleNoReturn").done(function(result) {
        expect(typeof result).toBe("object");
      });
    });


    it("require simpleObject", function() {
      return Module.import("tests/js/simpleObject").done(function(result) {
        expect(typeof result).toBe("object");
        expect(result.hello).toBe("world");
      });
    });


    it("require multipleDefine", function() {
      return Module.import("tests/js/multipleDefine").done(function(result) {
        expect(typeof result).toBe("object");
        expect(result.another).toBe("world");
      });
    });


    it("require simpleWithGlobal", function() {
      return Module.import("tests/js/simpleWithGlobal").done(function(result) {
        expect(global.AAAA1).toBe("now in the global space");
        expect(global.AAAA2).toBeUndefined();
        expect(typeof result).toBe("object");
        expect(result.hello).toBe("world");
      });
    });


    it("require dependencies", function() {
      return Module.import("tests/js/dependencies").done(function(result) {
        expect(typeof result.simpleObject).toBe("object");
        expect(result.simpleObject.hello).toBe("world");
        expect(result.dependenciesModule).toBe("present");
      });
    });


    it("require namedModuleObject", function() {
      return Module.import("tests/js/namedModuleObject").done(function(result) {
        expect(typeof result).toBe("object");
        expect(result.data).toBe("test");
      });
    });


    it("require namedModuleFunction", function() {
      return Module.import("tests/js/namedModuleFunction").done(function(result) {
        expect(typeof result).toBe("function");
        expect(result()).toBe("hello world");
      });
    });


//    it("require circular dependency", function() {
//      return Module.import("tests/js/circularDependencyA").done(function(result) {
//        console.log(result);
//      });
//    });


    it("require CJSsimpleObject", function() {
      return Module.import("tests/js/CJSsimpleObject").done(function(result) {
        expect(typeof result).toBe("object");
        expect(typeof result.init).toBe("function");
        expect(typeof result.dependencies).toBe("object");
        expect(result.init()).toBeUndefined();
        expect(result.dependencies.dependenciesModule).toBe("present");
        expect(result.dependencies.simpleObject.hello).toBe("world");
      });
    });


    it("require spromise", function() {
      return Module.import("src/spromise").done(function(result) {
        expect(typeof result).toBe("function");
        expect(typeof result().then).toBe("function");
      });
    });


    it("require fetch", function() {
      return Module.import("src/fetch").done(function(result) {
        expect(typeof result).toBe("function");
      });
    });


    it("require style", function() {
      return Module.import("src/style").done(function(result) {
        expect(typeof result).toBe("function");
      });
    });


    it("require view", function() {
      return Module.import("src/view").done(function(result) {
        expect(typeof result).toBe("function");
      });
    });

  });
});
