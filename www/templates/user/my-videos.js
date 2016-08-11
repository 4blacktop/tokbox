this_page = function() {
    return {
        get_data: function() {
            error_msg = $.i18n._('Unable to load your account data.');

            // Get user data
            data = $.core.get_from_api('multi/?requests={"videos/mine": {"as": "mine"}, "videos/viewed": {"as": "viewed"}, "videos/enrolled": {"as": "enrolled"}}', error_msg);

            if (!$.isEmptyObject(data))
                return data;
            else
                $.mobile.navigate('#my-account');
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Flipsnaps
            $.core.flipsnap('#my-videos-mine');
            $.core.flipsnap('#my-videos-viewed');
            $.core.flipsnap('#my-videos-enrolled');
        }
    };
};