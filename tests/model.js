define(["mortar/model"], function(model) {

  return function() {

    describe("Model", function() {

      it("simple get", function() {
        var _model = new model({
          "sample": "data"
        });

        expect(_model.get("sample")).toBe("data");
      });


      it("get url", function(done) {
        var _model = new model({}, {
          "url": "tests/json/simple.json"
        });

        _model.read()
          .done(function(data) {
            expect(this instanceof model).toBe(true);
            expect(this.get("hello")).toBe("world");
            expect(data.hello).toBe("world");
            done();
          });
      });


      it("simple update", function(done) {
        var _model = new model({
          "sample": "data"
        }, {
          "url": "tests/json/simple.json"
        });

        _model.update()
          .done(function(data) {
            done();
          })
          .fail(function() {
            done();
          });
      });

    });

  };

});
