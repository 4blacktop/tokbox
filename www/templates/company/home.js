this_page = function() {
    return {
        get_data: function() {
            // Get company data
            company = $.core.get_from_api('companies/mine', null);

            return company;
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Flipsnaps
            $.core.flipsnap('#my-company-members');
            $.core.flipsnap('#my-company-videos');
        },

        after_submit: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to save your company.')+' '+$.i18n._('Please try again.'));

            // Success
            $.core.show_success($.i18n._('Your company has been saved.'));
            window.setTimeout("$.core.reload();", 1500);
        },

        respond_to_invite: function(action, id) {
            if (action == 'accept' || action == 'deny') {
                success = false;
                $.core.put_to_api('companies-users/'+id, {action: action}, null, function(response) {
                    try {
                        response = $.parseJSON(response.responseText);

                        if (typeof(response.updates) != 'undefined')
                            if (response.updates.length) {
                                success = true;

                                response = response.updates[0];
                            }
                    }catch (e) {}

                    if (success) {
                        $.core.show_success($.i18n._('Invitation')+' '+(action == 'accept' ? $.i18n._('accepted') : $.i18n._('denied'))+'.');

                        // Update display
                        if (action == 'deny')
                            $('#company-invitation-'+id).slideUp(250, function() {
                                $(this).remove();
                            });
                        else
                            window.setTimeout(function() { $.core.reload(); }, 1000);
                    }else
                        $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to update that invitation.'));
                });
            }else
                $.core.show_error($.i18n._('An error has occurred.'));
        }
    };
};