this_page = function() {
    return {
        get_data: function() {
            error_msg = $.i18n._('Unable to load data.');

            // Get industries from API
            data = $.core.get_from_api('multi/?requests={"industries": {}, "regions": {}}', error_msg);

            return data;
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Init file upload
            $('#register input[name="cover_photo"]').file_upload('image', 'profile_pic', 'user-profile_pic');
        },

        before_submit: function() {
            if (!$('input[name="lang"]').length)
                $('#register_form').append('<input type="hidden" name="lang" value="'+$.i18n.get_lang()+'">');
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
                window.setTimeout("$.mobile.navigate('#home')", 1500);
            }else{
                // Show error
                $.core.show_success($.i18n._('An unknown error has occurred.')+' '+$.i18n._('You could not be logged in.'));
            }
        }
    };
};