this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load colleagues.');

            // Get mentor data
            data = $.core.get_from_api('users/my-colleagues', error_msg);

            if (!$.isEmptyObject(data)) {
                return data;
            }else{
                $.mobile.navigate('#home');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Flipsnap
            $.core.flipsnap('#colleagues-members');
        }
    };
};