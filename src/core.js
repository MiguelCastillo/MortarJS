define([
  "mortar/extender",
  "mortar/events",
  "mortar/hash.route",
  "mortar/model",
  "mortar/fetch",
  "mortar/style",
  "mortar/tmpl",
  "mortar/view"
], function(extender, events, hash, model, fetch, style, tmpl, view) {

  return {
    extender: extender,
    events: events,
    hash: hash,
    model: model,
    fetch: fetch,
    style: style,
    tmpl: tmpl,
    view: view
  };

});
