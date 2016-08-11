this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to look up user.');

            // Get user data
            id = $.core.qs('to_id');
            if (id)
                data = $.core.get_from_api('users/'+id, error_msg);
            else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                return data;
            }else{
                $.mobile.navigate('#inbox');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        },

        cb: function(response) {
            success = false;
            try {
                response = $.parseJSON(response.responseText);

                if (typeof(response.inserts) != 'undefined')
                    if (response.inserts.length) {
                        success = true;

                        response = response.inserts[0];
                    }
            }catch (e) {}

            if (success) {
                $.core.show_success($.i18n._('Your message has been sent.'));

                window.setTimeout("$.core.history.go(-1);", 1500);
            }else
                $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to save your reply.'));
        }
    };
};