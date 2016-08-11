this_page = function() {
    return {
        get_data: function() {
            error_msg = $.i18n._('Unable to load data.');

            // Get industries from API
            data = $.core.get_from_api('multi/?requests={"industries": {}, "regions": {}, "company_types": {}, "company_sizes": {}}', error_msg);

            return data;
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Init file upload
            $('#register-employers-2 input[name="cover_photo"]').file_upload('image', 'profile_pic', 'user-profile_pic');
            $('#register-employers-2 input[name="resume"]').file_upload('image', 'resume_uri', 'user-resume_uri');
            $('#register-employers-2 input[name="video"]').file_upload('video', 'raw_video_uri', 'user-video');

            // Dropdowns
            $('.dropdown-toggle').dropdown();
            $(document).on('click', '.yamm .dropdown-menu', function(e) {
                e.stopPropagation()
            });

            // Update 'single-tier' radio selections
            $.each(['company_type', 'company_size'], function(i, thing) {
                $('.dropdown-menu.'+thing+' input[type="radio"]').off('change');
                $('.dropdown-menu.'+thing+' input[type="radio"]').on('change', function(e) {
                    selections = {'': {}};
                    $('.dropdown-menu.'+thing+' input[type="radio"]').each(function(i, elem) {
                        if ($(elem).is(':checked')) {
                            selections[''][$(this).closest('label').text().trim()] = 1;
                        }
                    });

                    selections_str = $.pages['global']._parse_dropdown_selections(selections);

                    $('input[name="'+thing.replace(/s$/, '')+'"]').val(selections_str);

                    $(this).closest('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); return false;

                    e.preventDefault();
                    return false;
                });
            });

            // Disabled no-input inputs
            $('.dropdown.no-input .dropdown-toggle input[type="text"]').click(function(e) {
                $(this).blur();
            });

            // 'x' buttons handlers
            $('.dropdown a.x').off('click');
            $('.dropdown a.x').click(function(e) {
                $(this).closest('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); return false;

                e.preventDefault();
                return false;
            });
        },

        before_submit: function(data) {
            delete data.company_type;
            delete data.company_size;

            return data;
        },

        register_cb: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to save your account.')+' '+$.i18n._('Please try again.'));

            if (typeof(data.user) == 'object') {
                // Update session user
                $.core.session.set('user', data.user);

                // Update display
                $.core.update_dom();

                // Show success
                $.core.show_success($.i18n._('Thank you for completing your profile.'));

                // Redirect to home
                window.setTimeout("$.mobile.navigate('#home')", 1500);
            }else{
                // Show error
                $.core.show_success($.i18n._('Unable to refresh your display.')+' '+$.i18n._('Please log back in.'));

                // Redirect to login
                window.setTimeout("$.mobile.navigate('#login')", 1500);
            }
        }
    };
};