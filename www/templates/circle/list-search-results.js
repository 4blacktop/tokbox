this_page = function() {
    return {
        get_data: function() {
            // Get search results
            data = $.core.get_from_api('circle/?'+$.param($.core.qs()), null);

            return data;
        },

        after_load: function() {
        }
    };
};