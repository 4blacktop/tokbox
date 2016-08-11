this_page = function() {
    return {
        after_load: function() {
            // Load 'static' page content
            html = $.core.get_static_page('contact-us.php');
            if (html)
                $('#contact .mainContent .container').html(html);

            // Show back button
            $.core.show_back_arrow();
        }
    };
};