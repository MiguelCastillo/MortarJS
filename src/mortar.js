define([
  "src/extender",
  "src/events",
  "src/hash.route",
  "src/model",
  "src/fetch",
  "src/style",
  "src/tmpl",
  "src/view",
  "src/resources",
  "src/spromise"
], function(Extender, Events, Hash, Model, Fetch, Style, Tmpl, View, Resources, Promise, Module) {

  return {
    Extender: Extender,
    Events: Events,
    Hash: Hash,
    Model: Model,
    Fetch: Fetch,
    Style: Style,
    Tmpl: Tmpl,
    View: View,
    Resources: Resources,
    Promise: Promise,
    Module: Module
  };

});
