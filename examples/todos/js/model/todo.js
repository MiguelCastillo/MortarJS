(function( ) {
    'use strict';


    app.model.todo = Mortar.koModel.extend({
        data: read,
        _init: init
    });


    function init() {
        expandModel(this.data);
        initRoute(this.data);
    }


    function initRoute(model) {
        Mortar.hash(":root").on("change", function(evt, value) {
            model.filterMode(value);
        });
    }


    function read() {
        return  {
            items: JSON.parse(localStorage.getItem("todos-mortarjs")) || []
        };
    }


    function save(data) {
        localStorage.setItem("todos-mortarjs", JSON.stringify(data));
    }



    function expandModel(model) {
        var toggleState = false;

        function newItem(title, state) {
            return Mortar.koFactory({
                "completed": state === true,
                "title": title,
                "editing": false
            });
        }


        function itemsCompleted(status) {
            var items = model.items(),
                completed = [];
            var i, length;

            for ( i = 0, length = items.length; i < length; i++ ) {
                if ( items[i].completed() === status ) {
                    completed.push(items[i]);
                }
            }

            return completed;
        }


        Mortar.koFactory({
            editing: false,
            newItem: "",
            filterMode: ""
        }, model);


        model.itemsActive = ko.computed(function () {
            return itemsCompleted( false );
        });


        model.itemsCompleted = ko.computed(function() {
            return itemsCompleted( true );
        });


        model.filterables = ko.computed(function() {
            switch( model.filterMode() ){
                case "completed": {
                    return itemsCompleted(true);
                }
                case "active": {
                    return itemsCompleted(false);
                }
                default: {
                    return model.items();
                }
            }
        });


        model.toggleItems = function() {
            var items = itemsCompleted( toggleState );
            var i, length;

            // Swap states
            toggleState = !toggleState;
            if ( items.length ) {
                for ( i = 0, length = items.length; i < length; i++ ) {
                    items[i].completed( toggleState );
                }
            }
        };


        model.enableEdit = function() {
            model.editing(this);
            this.editing(true);

            // Create a self destructing subscription to keep track of when
            // editing is enabled/disabled when double clicking through the
            // todo items
            var subsription = this.editing.subscribe(function(value) {
                model.editing(value);
                subsription.dispose();
            });
        };


        model.disableEdit = function() {
            this.editing( false );
            return false; // Handle form submit
        };


        model.remove = function() {
            model.items.remove(this);
        };


        model.add = function() {
            // add item and clear input
            model.items.push( newItem( model.newItem(), false ) );
            model.newItem("");
            return false; // Handle form submit
        };


        model.clearCompleted = function() {
            var completedItems = itemsCompleted(true);
            var i, length;

            for ( i = 0, length = completedItems.length; i < length; i++ ) {
                model.items.remove(completedItems[i]);
            }
        };


        ko.computed(function() {
            if ( !model.editing() ) {
                save(Mortar.koFactory.deserialize(model.items));
            }
        }).extend({ throttle: 500 });
    }

})( );
