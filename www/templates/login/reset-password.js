this_page = function() {
    return {
        get_data: function() {
            error = false;
            user = false;
            if (!$.core.qs('i') || !$.core.qs('h'))
                error = true;
            else{
                user_id = $.core.qs('i');
                hash = $.core.qs('h');
                user = $.core.post_to_api('reset-password', {user_id: user_id, hash: hash}, null);
            }

            if (typeof(user.user_id) == 'undefined')
                error = true;

            if (!error) {
                return {
                    user_id: user_id,
                    hash: hash
                };
            }else{
                $.core.show_error($.i18n._('The link you followed was invalid or outdated.')+' '+$.i18n._('Please try again or start over.'));

                return false;
            }
        },

        after_load: function() {
        },

        cb: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to update your password.')+' '+$.i18n._('Please try again.'));

            // Success
            $.core.show_success($.i18n._('Your password has been updated.')+' '+$.i18n._('Please log in.'));
            window.setTimeout("$.mobile.navigate('#login');", 1500);
        }
    };
};