define(["mortar/view", "mortar/model", "mortar/rv.model"], function(view, model, rvmodel) {

  model.prototype.extend(rvmodel);

  describe("Views with rivets models", function() {

    it("view with local tmpl and model", function() {
      var _view = new view({
        resources: {
          "tmpl": "<div rv-text='hello'>hash content</div>",
          "model": {
            "hello": "world"
          }
        },
        events: {
          "view:ready": function() {
            // Test base properties
            expect(_view instanceof view).toBe(true);
            expect(_view.$el instanceof $).toBe(true);
            expect(_view.$el.html()).toBe('<div rv-text="hello">world</div>');
          }
        }
      });
    });


    it("view with remote tmpl and model", function(done) {
      var _view = new view({
        resources: {
          "tmpl!url": "tests/tmpl/rv.hello.html",
          "model": "tests/json/simple.json"
        },
        events: {
          "view:ready": function() {
            // Test base properties
            expect(_view instanceof view).toBe(true);
            expect(_view.$el instanceof $).toBe(true);
            expect(_view.$el.html()).toBe('<div><div rv-text="hello" class="hello">world</div></div>');

            done();
          }
        }
      });
    });

  });

});

