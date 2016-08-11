this_page = function() {
    return {
        get_data: function() {
            error_msg = $.i18n._('Unable to load your account data.');

            // Get user data
            data = $.core.get_from_api('multi/?requests={"users/me": {"as": "me"}, "industries": {}, "regions": {}, "company_types": {}, "company_sizes": {}, "education_requirements": {}}', error_msg);

            if (!$.isEmptyObject(data)) {
                $.my_data = data.me;

                return data;
            }else
                $.mobile.navigate('#home');
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Only keep the form pertaining to the current user type
            if (!$.core.session.get('user').is_mentor) {
                $('#account-mentor-info-form').remove();
console.log('is_mentor 1');
            }
            if (!$.core.session.get('user').is_student) {
                $('#account-student-info-form').remove();
console.log('is_student 1');
            }

            // Free/paid selector
            $('#account-mentor-info-form input[type="radio"][name="price-choice"]').change(function() {
                if ($(this).val() == 'paid')
                    $('#account-mentor-info-form .enter-price').slideDown();
                else
                    $('#account-mentor-info-form .enter-price').slideUp();
            });

            // Highlight current tab
            if ($('body').pagecontainer('getActivePage').attr('id') == 'my-account-mentor-info') {
                $('#account-personal-info-form').hide();
                $('#account-mentor-info-form').show();
                $('#my-account-mentor-info-tab').addClass('current');
            }else if ($('body').pagecontainer('getActivePage').attr('id') == 'my-account-student-info') {
                $('#account-personal-info-form').hide();
                $('#account-student-info-form').show();
                $('#my-account-student-info-tab').addClass('current');
            }else
                $('#my-account-personal-info-tab').addClass('current');

            // Init file uploads
            $('#my-account input[name="cover_photo"]').file_upload('image', 'profile_pic', 'user-profile_pic', '#edit-user-profile_pic', function(fileuri) {
                $('#my-account .user-header img.profile_pic').attr('src', fileuri);
                $('#my-account input#profile_pic').val(fileuri);
                $('#my-account .user-header').css('background-image', 'url("'+fileuri+'")');
                $('#my-account .progress-container').hide();
            });
            if ($.core.session.get('user').is_mentor) {
console.log('is_mentor 2');
                $('#account-mentor-info-form input[name="resume"]').file_upload('image', 'resume_uri', 'user-resume_uri');
                $('#account-mentor-info-form input[name="video"]').file_upload('video', 'raw_video_uri', 'user-video');
            }
            if ($.core.session.get('user').is_student) {
console.log('is_student 1');
                $('#account-student-info-form input[name="resume"]').file_upload('image', 'resume_uri', 'user-resume_uri');
                $('#account-student-info-form input[name="video"]').file_upload('video', 'raw_video_uri', 'user-video');
            }

            // Dropdowns
            $('.dropdown-toggle').dropdown();
            $(document).on('click', '.yamm .dropdown-menu', function(e) {
                e.stopPropagation()
            });

            // Update 'single-tier' radio selections
            $.each(['company_type', 'company_size', 'education'], function(i, thing) {
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

            $.video_player = {
                video_id: null,
                player: null,
                player_id: null,
                is_ready: false,
                is_playing: false,
                is_seeking: false
            };

            $.fn.init_video = function() {
                if (typeof($.my_data) == 'undefined')
                    return;

                // Stash id
                $.video_player.video_id = $.my_data.id;

                // Load video into DOM
                if (!$.my_data.video_uri)
                    return;
                $(this).append('<video id="video-video" class="video" style="width: 100%;" autobuffer controls="false" poster="'+$.my_data.profile_pic+'"><source src="'+$.my_data.video_uri+'" type="video/mp4"></video>');

                // Grab DOM stuff
                $.video_player.player = $(this).find('video');
                $.video_player.player_id = $.video_player.player.attr('id');

                // Start stats listener
                $.video_player.player.bind('canplay', function() {});
                $.video_player.player.bind('play', function() {
                    $.video_player.is_playing = true;
                });
                $.video_player.player.bind('canplay', function() {});
                $.video_player.player.bind('timeupdate', function() {});
                $.video_player.player.bind('ended', function() { $.video_player.is_playing = false; });
                $.video_player.player.bind('pause', function() { $.video_player.is_playing = false; });
            };
            $.fn.remove_video = function() {
                $(this).html('<img src="app-core/assets/images/invalid-video.png" alt="Invalid Video" style="display: block; max-width: 100%; max-height: 200px; margin: 0 auto;">');
            };

            // Go...
            $('.account-video-container').init_video();
        },

        before_submit: function(data) {
            // Remove 'illegal' fields from POST data
            delete data.company_type;
            delete data.company_size;
            delete data.education;

            return data;
        },

        update_cb: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to save your account information.')+' '+$.i18n._('Please try again.'));

            // Get updated user data from API
            $.core.get_from_api('users/me', null, function(response) {
                error = false;
                data = $.core.parse_api_response(response);
                if (!data) {
                    error = true;
                }else{
                    if (typeof(data.data) == 'undefined') {
                        error = true;
                    }else{
                        user = data.data;

                        // Update session user data
                        user = $.extend($.core.session.get('user'), user);
                        $.core.session.set('user', user);

                        // Update lang
                        $.i18n.set_lang(user.lang);
                    }
                }

                // Update lang
                if (error) {
                    $.i18n.set_lang($('select[name="lang"]').val());

                    return $.core.show_error('Unable to refresh your account information.');
                }
            });

            $.core.show_success($.i18n._('Your account information has been saved.'));

            // Reload if we are on mentor-info screen
            if ($('#account-mentor-info-form').is(':visible'))
                window.setTimeout(function() {
                    $.core.redirect('#my-account-mentor-info');
                }, 1500);
        }
    };
};