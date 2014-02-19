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
], function(extender, events, hash, model, fetch, style, tmpl, view, resources, promise) {

  return {
    extender: extender,
    events: events,
    hash: hash,
    model: model,
    fetch: fetch,
    style: style,
    tmpl: tmpl,
    view: view,
    resources: resources,
    promise: promise
  };

});
