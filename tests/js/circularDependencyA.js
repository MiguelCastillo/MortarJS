define([
  "tests/js/circularDependencyB"
], function(circularDependencyB) {
  return {
    "circularDependencyB": circularDependencyB,
    "circularDependencyA": "circularDependencyA"
  };
});
