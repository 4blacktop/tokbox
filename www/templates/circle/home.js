this_page = function() {
    return {
        get_data: function() {
            error_msg = $.i18n._('Unable to load circle data.');

            // Get data from API
            data = $.core.get_from_api('multi/?requests={"circle/num-unread": {"as": "num_unread_requests"}, "circle/my-mentors": {"as": "mentors"}, "circle/my-proteges": {"as": "proteges"}, "circle/my-friends": {"as": "friends"}}', error_msg);

            return data;
        },

        after_load: function() {
            $.core.flipsnap('#circle-mentors');
            $.core.flipsnap('#circle-proteges');
            $.core.flipsnap('#circle-friends');
        }
    };
};