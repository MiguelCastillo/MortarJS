define(["mortar"], function(Mortar) {

  var view = Mortar.view;

  return function() {

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
        expect(_view.path).toBeUndefined();
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


      it("view with path", function() {
        var _view = new view({
          path: "tests/views/hash"
        });

        // Test base properties
        expect(_view instanceof view).toBe(true);
        expect(_view.$el instanceof $).toBe(true);
        expect(_view.path).toBe("tests/views/hash");
        expect(_view.namespace).toBe("tests.views");
        expect(_view.name).toBe("hash");
      });


      it("view with local html tmpl", function() {
        var _view = new view({
          resources: {
            "tmpl": "<div>hash content</div>"
          },
        });

        // Test base properties
        expect(_view instanceof view).toBe(true);
        expect(_view.$el instanceof $).toBe(true);
        expect(_view.$el.html()).toBe("<div>hash content</div>");
      });


      it("view with remote html tmpl", function(done) {
        new view({
          path: "tests/tmpl/deep",
          resources: {
            "tmpl!url": ""
          },
          events: {
            "view:ready": function() {
              // Test base properties
              expect(this instanceof view).toBe(true);
              expect(this.$el instanceof $).toBe(true);
              done();
            }
          }
        });

      });

    });

  };

});

