define(["mortar/promise"], function(promise) {

  describe("Promises", function() {

    it("Simple thenable", function() {

      var promise1 = new promise();

      promise1.then(function(x) {
        console.log("tests", x);
        //return promise3;
      });

      promise1.resolve("simple value");
    });

  });

});

