this_page = function() {
    return {
        after_load: function() {
            // Load 'static' page content
            html = $.core.get_static_page('privacy.php');
            if (html)
                $('#privacy .mainContent .container').html(html);

            // Show back button
            $.core.show_back_arrow();
        }
    };
};