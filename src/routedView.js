define([
  "mortar/hash.route",
  "mortar/view"
], function(hash, view) {


  function create() {
    var _self = this;

    // When the hash changes, we will call the view method in order to
    // get a view instance that we are about to load.  When done, we will
    // call transition
    hash(this.route).on("change", function() {
      $.when(_self.view.apply(_self, arguments))
      .done(function(view) {
        if (view === false) {
          return;
        }

        _self.transition(view);
      });
    });
  }


  function transition(view) {
    if ( this.lastView == view ) {
      return;
    }

    if ( this.lastView ) {
      this.lastView.trigger("view:leave", [this]);

      if ( typeof this.lastView.destroy === "function" ) {
        this.lastView.destroy();
      }

      this.lastView = false;
    }

    this.lastView = view;

    // Append the view el to the container we have configured in the
    // routedView.
    this.$el.append(view.$el);
    view.trigger("view:enter", [this]);
  }


  return view.extend({
    transition: transition,
    view: $.noop,
    events: {
      "view:ready": create
    }
  });

});

