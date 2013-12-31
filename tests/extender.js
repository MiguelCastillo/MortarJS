define(["mortar/extender"], function(extender) {


  describe("Extender", function() {

    it("extend", function() {

      // Base class
      function base() {}
      base.prototype.yes = function() {}

      // Extend base class
      var extbase1 = extender.extend(base, {
        no: function() {
        }
      });

      // Instantiate inherited class
      var _instance = new extbase1();

      expect(_instance instanceof base).toBe(true);
      expect(_instance instanceof extbase1).toBe(true);
      expect(_instance.yes).toBeDefined();
      expect(_instance.no).toBeDefined();
    });


    it("3rd extend", function() {

      // Base class
      function base() {}
      base.prototype.yes = function() {
      }

      // Setup extender but this time to use base as the extending context
      base.extend = extender.extend;

      // Extend base class
      var extbase1 = base.extend({
        no: function() {
        }
      });

      var extbase2 = extbase1.extend({
        maybe: function() {
        }
      });

      var extbase3 = extbase2.extend({
        notachance: function() {
        }
      });


      var _instance = new extbase1();
      expect(_instance instanceof base).toBe(true);
      expect(_instance instanceof extbase1).toBe(true);
      expect(_instance instanceof extbase2).toBe(false);
      expect(_instance instanceof extbase3).toBe(false);
      expect(_instance.yes).toBeDefined();
      expect(_instance.no).toBeDefined();
      expect(_instance.maybe).toBeUndefined();
      expect(_instance.notachance).toBeUndefined();

      _instance = new extbase2();
      expect(_instance instanceof base).toBe(true);
      expect(_instance instanceof extbase1).toBe(true);
      expect(_instance instanceof extbase2).toBe(true);
      expect(_instance instanceof extbase3).toBe(false);
      expect(_instance.yes).toBeDefined();
      expect(_instance.no).toBeDefined();
      expect(_instance.maybe).toBeDefined();
      expect(_instance.notachance).toBeUndefined();

      _instance = new extbase3();
      expect(_instance instanceof base).toBe(true);
      expect(_instance instanceof extbase1).toBe(true);
      expect(_instance instanceof extbase2).toBe(true);
      expect(_instance instanceof extbase3).toBe(true);
      expect(_instance.yes).toBeDefined();
      expect(_instance.no).toBeDefined();
      expect(_instance.maybe).toBeDefined();
      expect(_instance.notachance).toBeDefined();
    });


    it("expand", function() {

      // Base class
      function base() {}

      // Setup extender
      extender.expand(base, {
        yes: function() {
        }
      });

      base.prototype.extend({
        no: function() {
        }
      });

      // Instantiate inherited class
      var _base = new base();

      expect(_base instanceof base).toBe(true);
      expect(_base.yes).toBeDefined();
      expect(_base.no).toBeDefined();
    });

  });

});
