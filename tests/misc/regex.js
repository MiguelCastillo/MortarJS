define(["text!tests/tmpl/regex.html"], function(tmpl) {

  return function() {
    describe("regex", function() {

      it("extra attributes", function() {

        var parts;
        var regex = /<(\w+)(\s+(.*?)=(?:"(.*?)"|'(.*?)’))*>/gi;

        while((parts = regex.exec(tmpl))){
          console.log(parts);
        }

      });

    });
  };


});
