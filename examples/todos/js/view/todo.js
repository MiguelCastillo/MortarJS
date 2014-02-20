(function( ) {
    'use strict';

    function getViewModel() {
        return new app.model.todo();
    }

    app.view.todo = Mortar.view.extend({
        fqn: 'js/view/todo',
        model: getViewModel
    });

})( );
