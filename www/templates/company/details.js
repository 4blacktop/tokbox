this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load company.');

            // Get company data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('companies/'+id, error_msg);
            else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                return data;
            }else{
                $.mobile.navigate('#home');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Flipsnaps
            $.core.flipsnap('#company-members');
            $.core.flipsnap('#company-videos');
        }
    };
};