this_page = function() {
    return {
        anim_duration: 250,

        get_data: function() {
            data = {
                'search_q': $.core.qs('q'),
                'search_relationship_type': $.core.qs('relationship_type')
            };

            return data;
        },

        after_load: function() {
            // Init search form
            $('#circle-search-form').init_search_form('#circle .content, #circle .content *, #circle-search .content, #circle-search .content *');
        },

        before_submit: function() {
            // Show loading
            $.core.show_loading();
        },
        at_submit: function(href) {
            href = (typeof(href) == 'undefined' ? null : href);

            // If we are not already on the search results page, do nothing (which will allow the search results page to load)
            if (!$('#circle-search .content .users').length)
                return;

            // Add history entry
            page_history = $.core.history.add('#circle-search', $.core.qs());

            // Load page
            $('#circle-search').handlebars(page_history.id, function() {
                $.core.show_back_arrow();
            });
        }
    };
};