define(function() {
  var urlRexeg = /^(?:([A-Za-z]+:)\/{2,})?([^:|\/|\\|#|?]+)?(?::([0-9]+))?([^#|?]+)?/;
  //var urlProtocol = /^(?:([A-Za-z]+:)\/{2,})?/;

  describe("URL Regex", function() {

    it("basic", function() {
      var url1 = "http://google.com:80".match(urlRexeg);
      url1.shift();

      expect(url1[0]).toBe("http:");
      expect(url1[1]).toBe("google.com");
      expect(url1[2]).toBe("80");
      expect(url1[3]).toBeUndefined();
    });

    it("path", function() {
      var url1 = "http://google.com/my/tests".match(urlRexeg);
      url1.shift();

      expect(url1[0]).toBe("http:");
      expect(url1[1]).toBe("google.com");
      expect(url1[2]).toBeUndefined();
      expect(url1[3]).toBe("/my/tests");
    });

    it("port, path, and HASH", function() {
      var url1 = "http://google.com:8989/my/tests/#myhome".match(urlRexeg);
      url1.shift();

      expect(url1[0]).toBe("http:");
      expect(url1[1]).toBe("google.com");
      expect(url1[2]).toBe("8989");
      expect(url1[3]).toBe("/my/tests/");
    });

    it("port, path, and CGI", function() {
      var url1 = "http://google.com:8989/my/tests/?myhome=nowhere".match(urlRexeg);
      url1.shift();

      expect(url1[0]).toBe("http:");
      expect(url1[1]).toBe("google.com");
      expect(url1[2]).toBe("8989");
      expect(url1[3]).toBe("/my/tests/");
    });

    it("no host with path and CGI", function() {
      var url1 = "/my/tests/?myhome=nowhere".match(urlRexeg);
      url1.shift();

      expect(url1[0]).toBeUndefined();
      expect(url1[1]).toBeUndefined();
      expect(url1[2]).toBeUndefined();
      expect(url1[3]).toBe("/my/tests/");
    });

    it("backward path \\", function() {
      var url1 = "http://google.com\\my\\tests/".match(urlRexeg);
      url1.shift();

      expect(url1[0]).toBe("http:");
      expect(url1[1]).toBe("google.com");
      expect(url1[2]).toBeUndefined();
      expect(url1[3]).toBe("\\my\\tests/");
    });

    it("CGI", function() {
      var url1 = "http://google.com?my=tests".match(urlRexeg);
      url1.shift();

      expect(url1[0]).toBe("http:");
      expect(url1[1]).toBe("google.com");
      expect(url1[2]).toBeUndefined();
      expect(url1[3]).toBeUndefined();
    });

    it("port and HASH", function() {
      var url1 = "http://google.com:80#my=tests".match(urlRexeg);
      url1.shift();

      expect(url1[0]).toBe("http:");
      expect(url1[1]).toBe("google.com");
      expect(url1[2]).toBe("80");
      expect(url1[3]).toBeUndefined();
    });
  });

});
