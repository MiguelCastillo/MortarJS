// Hash will ignore starting and trailing slashes in the url to
// do its matches.

define(function(require, exports, module) {

  var hash = require("mortar/hash.route");

  // Match empty route
  hash("").on("change", function(evt) {
    console.log(arguments);
  });


  // Exact match
  // Will match only if home is the only parameter in the url. E.g.
  // home, will match
  // /home/, will match
  // home/sweet, will not match
  hash("home").on("change", function(evt) {
    console.log(arguments);
  });


  // Exact match and trailing slash
  // Will match only if home is the only parameter in the url. E.g.
  // home, will not match
  // home/, will match
  // home/sweet, will not match
  hash("home/").on("change", function(evt) {
    console.log(arguments);
  });


  // : parameter values
  // Will match the specific patten and will extract values in the particular
  // position in the url. E.g.
  // home/u21/test/age -> val1 = 21, val2 = age
  hash("home/u:val1/:val2").on("change", function(evt, val1, val2) {
    console.log(arguments);
  });


  // *: optional parameter values
  // Will return val1 if it exists, and will return val2 if it exists. E.g.
  // home -> val1 = "", val2 = ""
  // home/magic -> val1 = "magic", val2 = ""
  // home/magic/books -> val1 = "magic", val2 = "books"
  hash("home/*u:val1/*:val2").on("change", function(evt, val1, val2) {
    console.log(arguments);
  });


  // **: whole parameter value
  // Will return val1 if it exists, and will return val2 if it exists. E.g.
  // home -> val1 = "", val2 = ""
  // home/magic -> val1 = "magic"
  // home/magic/books -> val1 = "magic/books"
  hash("home/**u:val1").on("change", function(evt) {
    console.log(arguments);
  });


  // /** Wild card
  // Will match home and anything there after
  hash("home/**").on("change", function(evt) {
    console.log(arguments);
  });


  // /** Wild card
  // Will match home and will extract the last param in the url. E.g.
  // home/test -> val1 = test
  // home/test/candy -> val1 = candy
  // home/test/candy/coffee -> val1 = coffee
  hash("home/**/:val1").on("change", function(evt) {
    console.log(arguments);
  });

});
