this_page = function() {
    return {
        after_load: function(page_name) {
            // Show appropriate header
            if (page_name.match(/^home/)) {
                $('#subpage-header').hide();
                $('#home-header').show();

                $('.main-nav').removeClass('subpage');
                $('.main-nav').addClass('home');
            }else{
                $('#home-header').hide();
                $('#subpage-header').show();

                $('.main-nav').removeClass('home');
                $('.main-nav').addClass('subpage');
            }

            // Update header & footer
            $.core.update_header(page_name);
            $.core.update_footer(page_name);
        },

        _parse_dropdown_selections: function(selections) {
            selections_str = '';
            $.each(selections, function(k, v) {
                if (k.trim())
                    selections_str += k+': ';

                $.each(v, function(selection, bool) {
                    if (bool)
                        selections_str += selection+', ';
                });
                selections_str = selections_str.replace(/, $/, '');
                selections_str += '; ';
            });
            selections_str = selections_str.replace(/; $/, '');

            return selections_str;
        }
    };
};