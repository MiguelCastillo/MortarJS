define(["src/view"], function(view) {

  describe("View", function() {

    it("base view", function() {
      var _view = new view();

      // Test base properties
      expect(_view instanceof view).toBe(true);
      expect(_view.$el instanceof $).toBe(true);
      expect(_view._create).toBeDefined();
      expect(_view._destroy).toBeDefined();
      expect(_view.events).toBeDefined();
      expect(_view.on).toBeDefined();
      expect(_view.off).toBeDefined();
      expect(_view.fqn).toBeUndefined();
      expect(_view.namespace).toBeUndefined();
      expect(_view.name).toBeUndefined();
    });


    it("extended view", function() {
      var extview1 = view.extend({
        yes: function() {
        }
      });

      var _view = new extview1({
        tagName: "span",
        name: "extended view",
        no: function() {
        }
      });

      expect(_view instanceof view).toBe(true);
      expect(_view instanceof extview1).toBe(true);
      expect(_view.$el instanceof $).toBe(true);
      expect(_view.$el.is("span")).toBe(true);
      expect(_view.name).toBe("extended view");
      expect(_view.tagName).toBe("span");
      expect(_view.yes).toBeDefined();
      expect(_view.no).toBeDefined();

      _view = new extview1();
      expect(_view instanceof view).toBe(true);
      expect(_view instanceof extview1).toBe(true);
      expect(_view.$el instanceof $).toBe(true);
      expect(_view.$el.is("div")).toBe(true);
      expect(_view.name).toBeUndefined()
      expect(_view.tagName).toBe("div");
      expect(_view.yes).toBeDefined();
      expect(_view.no).toBeUndefined();
    });


    it("3rd extended view", function() {
      var extview1 = view.extend({
        yes: function() {
        }
      });

      var extview2 = extview1.extend({
        tagName: "span",
        name: "extended view",
        no: function() {
        }
      });

      var extview3 = extview2.extend({
        maybe: function() {
        }
      });

      var _view = new extview3({
        noway: function() {
        }
      });

      expect(_view instanceof view).toBe(true);
      expect(_view instanceof extview1).toBe(true);
      expect(_view instanceof extview2).toBe(true);
      expect(_view instanceof extview3).toBe(true);
      expect(_view.$el instanceof $).toBe(true);
      expect(_view.$el.is("span")).toBe(true);
      expect(_view.name).toBe("extended view");
      expect(_view.tagName).toBe("span");
      expect(_view.yes).toBeDefined();
      expect(_view.no).toBeDefined();
      expect(_view.maybe).toBeDefined();
      expect(_view.noway).toBeDefined();
    });


    it("view with fqn", function() {
      var _view = new view({
        fqn: "tests/views/hash",
        resources: {
          "tmpl": false
        }
      });

      // Test base properties
      expect(_view instanceof view).toBe(true);
      expect(_view.$el instanceof $).toBe(true);
      expect(_view.fqn).toBe("tests/views/hash");
      expect(_view.settings.namespace).toBe("tests.views");
      expect(_view.settings.name).toBe("hash");
    });


    it("view with local html tmpl", function() {
      var _view = new view({
        resources: {
          "tmpl": "<div>hash content</div>"
        }
      });

      return _view.ready(function() {
        // Test base properties
        expect(_view instanceof view).toBe(true);
        expect(_view.$el instanceof $).toBe(true);
        expect(_view.$el.html()).toBe("<div>hash content</div>");
      });
    });


    it("view with remote html tmpl", function() {
      var _view = new view({
        fqn: "tests/tmpl/deep",
        resources: {
          "tmpl!url": ""
        }
      });

      return _view.ready(function() {
        expect(_view instanceof view).toBe(true);
        expect(_view.$el instanceof $).toBe(true);
      });
    });

  });

});

