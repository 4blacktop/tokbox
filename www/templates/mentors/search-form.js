this_page = function() {
    return {
        anim_duration: 250,

        get_data: function() {
            data = {
                'search_q': $.core.qs('q')
            };

            return data;
        },

        after_load: function() {
            // Init search form
            $('#mentors-search-form').init_search_form('#mentors .content, #mentors .content *, #mentors-search .content, #mentors-search .content *');
        },

        before_submit: function() {
            // Show loading
            $.core.show_loading();
        },
        at_submit: function(href) {
            href = (typeof(href) == 'undefined' ? null : href);

            // If we are not already on the search results page, do nothing (which will allow the search results page to load)
            if (!$('#mentors-search .content .mentors').length)
                return;

            // Add history entry
            page_history = $.core.history.add('#mentors-search', $.core.qs());

            // Load page
            $('#mentors-search').handlebars(page_history.id, function() {
                $.core.show_back_arrow();
            });
        }
    };
};