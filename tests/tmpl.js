/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(["mortar/tmpl"], function(tmpl) {

  return function() {

    describe("tmpl tests", function() {

      it("basic tmpl", function(done) {
        tmpl({
          url: "tests/tmpl/simple.html"
        })
        .done(function(html) {
          // Get content
          var result = $("<div>").append(html).html();

          // [^]* to process newline boundaries
          expect(/^(<h1>Only one child<\/h1>)[^]*(<h1>Layer 1<\/h1><\/div>)$/.test(result)).toBe(true);
          done();
        });
      });


      it("multiple tmpls", function(done) {
        tmpl({
          url: "tests/tmpl/multiple.html"
        })
        .done(function(html) {
          var result = $("<div>").append(html).html();
          expect(/^(<h1>Multiple layers deep<\/h1>)[^]*(<h1>Layer 1<\/h1><\/div><\/div>)$/.test(result)).toBe(true);
          done();
        });
      });


      it("deeply nested tmpls", function(done) {
        tmpl({
          url: "tests/tmpl/deep.html"
        })
        .done(function(html) {
          var result = $("<div>").append(html).html();
          expect(/^(<h1>Deep multiple layers<\/h1>)[^]*(<h1>Layer 1<\/h1><\/div><\/div><\/div><\/div>)$/.test(result)).toBe(true);
          done();
        });
      });

    });

  };

});

