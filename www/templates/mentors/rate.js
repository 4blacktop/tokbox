this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load mentor.');

            // Get target user data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('mentors/'+id, error_msg);
            else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                return data;
            }else{
                $.mobile.navigate('#mentors');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        },

        cb: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to save your review.')+' '+$.i18n._('Please try again.'));

            // Success
            $.core.show_success($.i18n._('Your review has been saved.'));
            window.setTimeout("$.core.history.go(-1);", 1500);
        }
    };
};