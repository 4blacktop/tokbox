this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load your company.');

            // Get user data
            data = $.core.get_from_api('companies/mine', error_msg);

            if (!$.isEmptyObject(data)) {
                if (!data.i_am_company_admin) {
                    $.core.show_error($.i18n._('You are not a company admin.'));
                    $.mobile.navigate('#home');
                }

                return data;
            }else{
                $.mobile.navigate('#home');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Init file upload
            $('#edit-company input[name="cover_photo"]').file_upload('image', 'profile_pic', 'company-profile_pic', '#edit-company-profile_pic', function(fileuri) {
                $('#edit-company .company-header img.profile_pic').attr('src', fileuri);
                $('#edit-company input#profile_pic').val(fileuri);
                $('#edit-company .company-header').css('background-image', 'url("'+fileuri+'")');
                $('#edit-company .progress-container').hide();
            });

            // Flipsnap
            $.core.flipsnap('#edit-company-members');
        },

        update_cb: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to save your company information.')+' '+$.i18n._('Please try again.'));

            $.core.show_success($.i18n._('Your company information has been saved.'));
            window.setTimeout(function() { $.mobile.navigate('#my-company'); }, 1000);
        },

        change_admin: function(action, id) {
            $.core.confirm((action == 'add' ? $.i18n._('Allow this user to administer your company?') : $.i18n._('Stop allowing this user to administer your company?')), function() {
                success = false;
                $.core.put_to_api('companies-users/'+id, {is_admin: (action == 'add' ? '1' : '0')}, null, $.pages['company.edit'].change_admin_cb(action, id));
            });
        },
        change_admin_cb: function(action, id) {
            return function(response) {
                if ($.core.parse_api_response(response)) {
                    $.core.show_success(action == 'add' ? $.i18n._('That member can now administer your company.') : $.i18n._('That member can no longer administer your company.'));

                    // Update DOM

                    if (action == 'add') {
                        $('#add-admin-'+id).hide();
                        $('#remove-admin-'+id).show();
                    }else{
                        $('#remove-admin-'+id).hide();
                        $('#add-admin-'+id).show();
                    }
                }else
                    $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to remove member.'));
            };
        },

        remove_user: function(id) {
            $.core.confirm($.i18n._('Remove this user from your company?'), function() {
                success = false;
                $.core.delete_from_api('companies-users/'+id, {}, null, function(response) {
                    try {
                        response = $.parseJSON(response.responseText);

                        if (typeof(response.success) != 'undefined')
                            if (response.success)
                                success = true;
                    }catch (e) {}

                    if (success) {
                        $.core.show_success($.i18n._('Member removed.'));

                        // Update DOM
                        $('#member-'+id).animate({'width': '0px'}, 500, function() {
                            $('#member-'+id).remove();
                        });
                        $.core.flipsnap('#edit-company-members');
                    }else
                        $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to remove member.'));
                });
            });
        }
    };
};