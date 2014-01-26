define(["src/spromise"], function(promise) {

  describe("Promises", function() {

    it("Simple thenable", function() {

      var promise1 = new promise();

      promise1.then(function(x) {
        expect(x).toBe("simple value");
      });

      return promise1.resolve("simple value");
    });


    it("Promise object return itself in then call", function() {
      var promise1 = new promise();

      var promise2 = promise1.then(function(x) {
        expect(x).toBe("simple value");
        return promise2;
      })
      .fail(function(ex) {
        expect(ex).toBeDefined();
      })
      .done(function(x) {
        expect(this).toBe("never called");
      });

      return promise1.resolve("simple value");
    });


    it("Simple thenable chain", function() {
      var promise1 = promise();

      var promise2 = promise1.then(function(x) {
        expect(x).toBe("Thenable returning thenable simple value");
        return promise().resolve("first chain");
      });

      promise2.then(function(x) {
        expect(x).toBe("first chain");
      });

      promise1.resolve("Thenable returning thenable simple value");
      return promise2;
    });


    it("Thenable returning thenable", function() {
      var promise1 = promise();
      var promise6 = promise();

      var promise2 = promise1.then(function(x) {
        expect(x).toBe("Thenable returning thenable simple value");
        return promise().resolve("first chain");
      });

      var promise3 = promise2.then(function(x) {
        expect(x).toBe("first chain");
        return promise().resolve("second chain");
      });

      promise3.then(function(x) {
        expect(x).toBe("second chain");
      })
      .done(function (x) {
        expect(x).toBe("second chain");
        // returning a promise only affects then and not done
        return promise().resolve("third chain");
      })
      .done(function (x) {
        expect(x).toBe("second chain");
      });

      promise1.resolve("Thenable returning thenable simple value");
      return promise3;
    });


    it("Long promise thenable chain", function() {
      var promise1 = new promise();

      promise1.then(function(x) {
        expect(x).toBe("simple value");
        return promise.revoled("tests1");
      })
      .then(function(x) {
        expect(x).toBe("tests1");
        return promise.revole("tests2");
      })
      .then(function(x) {
        expect(x).toBe("tests2");
        return promise.resolve("tests3");
      })
      .then(function(x) {
        expect(x).toBe("tests4");
        return promise.resolve("tests5");
      })
      .then(function(x) {
        expect(x).toBe("tests5");
      });

      return promise1.resolve("simple value");
    });


    it("Resolve with multiple object arguments", function() {

      var promise1 = new promise();

      promise1.done(function(_actor, _categories, _books) {
        expect(_actor).toBeDefined();
        expect(_actor.firstName).toBe("Dracula");
        expect(_actor.nickName).toBe("Vampire");

        expect(_categories).toBeDefined();
        expect(_categories.scifi).toBe("Star Trek");
        expect(_categories.drama).toBe("I am sam");

        expect(_books).toBeDefined();
        expect(_books instanceof Array).toBe(true);
        expect(_books[0]).toBe("Harri Potter");
        expect(_books[1]).toBe("Lord of The Rings");
      });

      var actor = {
        "firstName": "Dracula",
        "nickName": "Vampire"
      };

      var categories = {
        "scifi": "Star Trek",
        "drama": "I am sam"
      };

      var books = ["Harri Potter", "Lord of The Rings"];

      return promise1.resolve(actor, categories, books);
    });


    it("When with multiple arguments", function() {

      var promise1 = new promise();

      promise.when(promise1).done(function(_actor, _categories, _books) {
        expect(_actor).toBeDefined();
        expect(_actor.firstName).toBe("Dracula");
        expect(_actor.nickName).toBe("Vampire");

        expect(_categories).toBeDefined();
        expect(_categories.scifi).toBe("Star Trek");
        expect(_categories.drama).toBe("I am sam");

        expect(_books).toBeDefined();
        expect(_books instanceof Array).toBe(true);
        expect(_books[0]).toBe("Harri Potter");
        expect(_books[1]).toBe("Lord of The Rings");
      });

      var actor = {
        "firstName": "Dracula",
        "nickName": "Vampire"
      };

      var categories = {
        "scifi": "Star Trek",
        "drama": "I am sam"
      };

      var books = ["Harri Potter", "Lord of The Rings"];

      return promise1.resolve(actor, categories, books);
    });


    it("When $.ajax", function() {
      var promise1 = $.ajax("tests/json/array.json");

      return promise.when(promise1).done(function(data, code, xhr) {
        // Make sure first param is the data
        expect(data.length).toBe(2);
        expect(data[0].name).toBe("Pablo");
        expect(data[1].name).toBe("Vincent");

        // Second param is the state code
        expect(code).toBe("success");

        // Third is the xhr
        expect(xhr.status).toBe(200);
        expect(xhr.then).toBeDefined();
        expect(xhr.readyState).toBe(4);
      });
    });


    it("When $.ajax, undefined", function() {
      var promise1 = $.ajax("tests/json/array.json");

      return promise.when(promise1, undefined).done(function(response, _undefined) {
        expect(_undefined).toBeUndefined();

        // Make sure first param is the data
        expect(response[0].length).toBe(2);
        expect(response[0][0].name).toBe("Pablo");
        expect(response[0][1].name).toBe("Vincent");

        // Second param is the state code
        expect(response[1]).toBe("success");

        // Third is the xhr
        expect(response[2].status).toBe(200);
        expect(response[2].then).toBeDefined();
        expect(response[2].readyState).toBe(4);
      });
    });


  });

});
