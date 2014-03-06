define([
  "tests/js/circularDependencyA"
], function(circularDependencyA) {
  return {
    "circularDependencyA": circularDependencyA,
    "circularDependencyB": "circularDependencyB"
  };
});
