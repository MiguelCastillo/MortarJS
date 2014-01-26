define([
  "src/extender",
  "src/events",
  "src/hash.route",
  "src/model",
  "src/fetch",
  "src/style",
  "src/tmpl",
  "src/view",
  "src/spromise"
], function(extender, events, hash, model, fetch, style, tmpl, view, promise) {

  return {
    extender: extender,
    events: events,
    hash: hash,
    model: model,
    fetch: fetch,
    style: style,
    tmpl: tmpl,
    view: view,
    promise: promise
  };

});
