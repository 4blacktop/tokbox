this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load company.');

            // Get company data
            data = $.core.get_from_api('companies/mine', error_msg);

            if (!$.isEmptyObject(data)) {
                if (!data.i_am_company_admin) {
                    $.core.show_error($.i18n._('You are not a company admin.'));
                    $.mobile.navigate('#home');
                }

                return {company: data};
            }else{
                $.mobile.navigate('#my-company');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        },

        before_submit: function() {
            // Require search entry
            q = $('#invite-to-company-form input[name="q"]').val();
            if (!$.trim(q)) {
                $.core.show_error($.i18n._('Please enter a name, email address, phone number, or username to search for.'));
                return false;
            }

            // Find users
            users = $.core.get_from_api('users/?'+$.param({q: q})+'&with=invitation_status', $.i18n._('No users found.'));

            // Show
            $('#invite-to-company-search-results').html('<img src="assets/images/loading.gif" alt="loading..." style="display: block; margin: 0 auto;">');
            $('#invite-to-company-search-results').show();

            // Load results into DOM
            $('#invite-to-company-search-results').load_template_manually('company/invite-search-results.handlebars.html', {users: users}, function() {
                // Flipsnap
                $.core.flipsnap('#invite-members');
            });

            return false;
        },

        invite: function(id) {
            success = false;
            $.core.post_to_api('companies-users/', {user_id: id}, null, function(response) {
                try {
                    response = $.parseJSON(response.responseText);

                    if (typeof(response.success) != 'undefined')
                        if (response.success)
                            success = true;
                }catch (e) {}

                if (success) {
                    $.core.show_success($.i18n._('Your invitation has been sent.'));

                    // Update button
                    $('#request-friend-'+id).removeClass('checkmark').addClass('waiting').addClass('disabled').text($.i18n._('Invited')).attr('onclick', 'return false');
                }else
                    $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to send your invitation.'));
            });
        }
    };
};