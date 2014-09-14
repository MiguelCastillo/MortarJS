define(["src/utils"], function(utils) {

  describe("Utils", function() {
    it("isRealObject", function() {
      expect(utils.isPlainObject({})).toBe(true);
      expect(utils.isPlainObject(null)).toBe(false);
      expect(utils.isPlainObject(new Date())).toBe(false);
      expect(utils.isPlainObject(undefined)).toBe(false);
      expect(utils.isPlainObject(function(){})).toBe(false);
    });

    it("isObject", function() {
      expect(utils.isObject({})).toBe(true);
      expect(utils.isObject(null)).toBe(true);
      expect(utils.isObject(new Date)).toBe(true);
      expect(utils.isObject(undefined)).toBe(false);
      expect(utils.isObject(function(){})).toBe(false);
    });

    it("isFunction", function() {
      expect(utils.isFunction({})).toBe(false);
      expect(utils.isFunction(null)).toBe(false);
      expect(utils.isFunction(new Date)).toBe(false);
      expect(utils.isFunction(undefined)).toBe(false);
      expect(utils.isFunction(function(){})).toBe(true);
    });

    it("extend", function() {
      var target = utils.extend({}, {"one": "dont"}, {"two": "twotest", "one": "onetest"});
      expect((target).toString() === "[object Object]").toBe(true);
      expect(target.one).toBe("onetest");
      expect(target.two).toBe("twotest");
    });
  });

});
