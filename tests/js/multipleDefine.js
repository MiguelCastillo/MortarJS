define("tests/js/multipleDefine", {
  "another": "world"
});

define({
  "hello": "world"
});

define("a", {
  "Ahello": "world"
});

define("a", {
  "ABad": "world"
});

define("c", ["b"], function(b) {
  return {
    "b": b,
    "Chello": "world"
  };
});

define("b", {
  "Bhello": "world"
});
