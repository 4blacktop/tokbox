this_page = function() {
    return {
        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        },

        before_submit: function(data) {
            data.is_student = true;
            if (typeof(data.lang) == 'undefined')
                data.lang = $.i18n.get_lang();

            return data;
        },

        register_cb: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to create your account.')+' '+$.i18n._('Please try again.'));

            // Attempt to log in
            if (typeof(data.user) == 'object') {
                // Log in user
                $.core.session.set('user', data.user);

                // Update display
                $.core.update_dom();

                // Show success
                $.core.show_success($.i18n._('Your account has been created and you have been logged in.'));

                // Redirect to home
                window.setTimeout("$.mobile.navigate('#register-employees-2')", 1500);
            }else{
                // Show error
                $.core.show_success($.i18n._('An unknown error has occurred.')+' '+$.i18n._('You could not be logged in.'));
            }
        }
    };
};