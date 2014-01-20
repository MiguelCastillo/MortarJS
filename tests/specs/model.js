define(["mortar/model"], function(model) {

  describe("Model.", function() {

    it("verify data type and get property in model.data", function() {
      var _model = new model({
        "sample": "data"
      });

      expect(_model.get("sample")).toBe("data");
      expect(typeof _model.data === "object").toBe(true);
    });


    it("verify data type of the model.data and get property in array item", function() {
      var _model = new model([
        {
          "sample": "data"
        }, {
          "hello": "world"
        }
      ]);

      expect(_model.data instanceof Array).toBe(true);
      expect(_model.data[0].sample).toBe("data");
      expect(_model.data[1].hello).toBe("world");
    });


    // In order to be able ot have reserved properties in a model data, you will
    // need to specify an options object.  This is so that Mortar model uses the
    // first parameter as data rather than possibly config options
    it("object with reserved properties as data", function() {
      var _model = new model({
        "url": "data",
        "events": "nothing",
        "datasource": "local storage"
      }, {
        "url": "dummy url"
      });

      expect(_model.get("url")).toBe("data");
      expect(_model.get("events")).toBe("nothing");
      expect(_model.get("datasource")).toBe("local storage");
      expect(_model.url).toBe("dummy url");
      expect(typeof _model.data === "object").toBe(true);
    });


    it("single url param for object", function() {
      var _model = new model("tests/json/simple.json");

      return _model.read()
        .done(function(data) {
          expect(this instanceof model).toBe(true);
          expect(typeof this.data === "object").toBe(true);
          expect(this.get("hello")).toBe("world");
          expect(data.hello).toBe("world");
        });
    });


    it("single url param for array", function() {
      var _model = new model("tests/json/array.json");

      return _model.read()
        .done(function(data) {
          expect(this instanceof model).toBe(true);
          expect(this.data instanceof Array).toBe(true);
          expect(this.data[0].name).toBe("Pablo");
        });
    });


    it("empty object model and url param", function() {
      var _model = new model({}, "tests/json/simple.json");

      return _model.read()
        .done(function(data) {
          expect(this instanceof model).toBe(true);
          expect(this.get("hello")).toBe("world");
          expect(data.hello).toBe("world");
        });
    });


    it("get default empty model and options url", function() {
      var _model = new model({}, {
        "url": "tests/json/simple.json"
      });

      return _model.read()
        .done(function(data) {
          expect(this instanceof model).toBe(true);
          expect(this.get("hello")).toBe("world");
          expect(data.hello).toBe("world");
        });
    });

  });

});
