this_page = function() {
    return {
        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        },

        cb: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to look up your account.')+' '+$.i18n._('Please try again.'));

            // Success
            $.core.show_success($.i18n._('Please check your inbox for instructions.'));
        }
    };
};