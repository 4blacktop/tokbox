this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load message.');

            // Get user data
            data = $.core.get_from_api('messages/', error_msg);

            return data;
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        }
    };
};