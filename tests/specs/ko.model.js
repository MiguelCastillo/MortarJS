define(["mortar/ko.model", "mortar/fetch", "mortar/promise"], function(model, fetch, promise) {

  describe("ko model", function() {

    it("basic get", function() {
      var _model = new model({
        "hello": "world"
      });

      expect(_model.data.hello).toBe("world");
    });


    it("model url/serialize", function( ) {
      var _model = new model({}, "tests/json/artists.json");

      return promise.when.apply(undefined, [_model.read(), fetch("tests/tmpl/ko.artists.html")]).done(function(data, html) {
        var $html = $(html[0]);//.appendTo("body");
        _model.bind($html);

        // Serialized data.
        var modelData = _model.deserialize();
      });
    });


    it("hello world with HTML", function( ) {
      var _model = new model({
        "hello": "world"
      });

      return fetch("tests/tmpl/ko.hello.html").done(function(html) {
        var $html  = $(html),
            $hello = $(".hello", $html);

        _model.bind($html);

        // Make sure data is in the model...
        expect(_model.data.hello()).toBe("world");
        expect($hello.html()).toBe("world");
      });
    });


    it("form test with HTML", function( ) {
      var _model = new model({
        "hello": "world",
        "username": "manchagnu",
        "password": "tryagain"
      });

      return fetch("tests/tmpl/ko.form.html").done(function(html) {
        var $html     = $(html),
            $hello    = $(".hello", $html),
            $username = $(".username", $html),
            $password = $(".password", $html);

        _model.bind($html);

        // Make sure data is in the model...
        expect(_model.data.hello()).toBe("world");
        expect(_model.data.username()).toBe("manchagnu");
        expect(_model.data.password()).toBe("tryagain");

        // Make sure data made it to the dom from the initial call to bind
        expect($hello.html()).toBe("world");
        expect($username.val()).toBe("manchagnu");
        expect($password.val()).toBe("tryagain");

        _model.data.username("tempusername");
        // Test that the new value is set in the model
        expect(_model.data.username()).toBe("tempusername");
        // Test that the value is in the dom
        expect($username.val()).toBe("tempusername");

        // Change the value of the input.  Must call change to simulate an actual
        // user input change in the browser.
        $username.val("newusername").change();
        // Varify the value of the input
        expect($username.val()).toBe("newusername");
        // Verify the value in the model
        expect(_model.data.username()).toBe("newusername");
      });
    });

  });

});
