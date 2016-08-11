this_page = function() {
    return {
        get_data: function() {
            error_msg = $.i18n._('Unable to load mentors data.');

            // Get data from API
            data = $.core.get_from_api('multi/?requests={"mentors/popular": {"as": "popular"}, "mentors/recommended": {"as": "recommended"}, "mentors/new": {"as": "new"}}', error_msg);

            return data;
        },

        after_load: function() {
            $.core.flipsnap('#mentors-popular');
            $.core.flipsnap('#mentors-recommended');
            $.core.flipsnap('#mentors-new');
        }
    };
};