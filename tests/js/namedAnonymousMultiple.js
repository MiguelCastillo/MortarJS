define({
  "hello": "world"
});

// this should take presedence than anonymous definitions
define("tests/js/multipleDefine", {
  "another": "world"
});
