define(["mortar/rv.model", "mortar/resource"], function(model, resource) {

  return function() {

    describe("rv model", function() {

      it("basic model", function( ) {
        var _model = new model({
          "hello": "world"
        });

        expect(_model.data.hello).toBe("world")
      });


      it("model url/serialize", function( done ) {
        var _model = new model({}, "tests/json/artists.json");

        $.when.apply($, [_model.read(), resource("tests/tmpl/rv.artists.html")]).done(function(data, html) {
          var $html = $(html[0]);//.appendTo("body");
          _model.bind($html);

          // Serialized data.
          var modelData = _model.deserialize();
          done();
        });
      });


      it("hello world with HTML", function( done ) {
        var _model = new model({
          "hello": "world"
        });

        resource("tests/tmpl/rv.hello.html").done(function(html) {
          var $html  = $(html),
              $hello = $(".hello", $html);

          _model.bind($html);

          // Make sure data is in the model...
          expect(_model.get("hello")).toBe("world");
          expect($hello.html()).toBe("world");

          // jasmine Test is done
          done();
        });
      });


      it("form test with HTML", function( done ) {
        var _model = new model({
          "hello": "world",
          "username": "manchagnu",
          "password": "tryagain"
        });

        resource("tests/tmpl/rv.form.html").done(function(html) {
          var $html     = $(html),
              $hello    = $(".hello", $html),
              $username = $(".username", $html),
              $password = $(".password", $html);

          _model.bind($html);

          // Make sure data is in the model...
          expect(_model.get("hello")).toBe("world");
          expect(_model.get("username")).toBe("manchagnu");
          expect(_model.get("password")).toBe("tryagain");

          // Make sure data made it to the dom from the initial call to bind
          expect($hello.html()).toBe("world");
          expect($username.val()).toBe("manchagnu");
          expect($password.val()).toBe("tryagain");

          // Test that setting a new value returns the old value
          expect(_model.set("username", "tempusername"));
          // Test that the new value is set in the model
          expect(_model.get("username")).toBe("tempusername");
          // Test that the value is in the dom
          expect($username.val()).toBe("tempusername");

          // Change the value of the input.  Must call change to simulate an actual
          // user input change in the browser.
          $username.val("newusername").change();
          // Varify the value of the input
          expect($username.val()).toBe("newusername");
          // Verify the value in the model
          expect(_model.get("username")).toBe("newusername");

          // jasmine Test is done
          done();
        });
      });

    });

  };

});