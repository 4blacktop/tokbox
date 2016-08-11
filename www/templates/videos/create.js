this_page = function() {
    return {
        get_data: function() {
            // Check for eligibility
            eligibility = $.core.get_from_api('users/me', $.i18n._('Unable to load data.'));
            if (!$.isEmptyObject(eligibility)) {
                if (!eligibility.is_eligible_to_create_video) {
                    $.core.show_error($.i18n._('You must purchase package credits in order to create a job listing.'));
                    return $.mobile.navigate('#my-account-mentor-info');
                }

                // Get categories,  upload_token from API
                data = $.core.get_from_api('multi/?requests={"positions": {"as-schema": 1}, "industries": {"as-schema": 1}, "regions": {"by_first_letter": 1}, "upload_tokens": {"as": "upload_token"}, "experience_requirements": {}, "education_requirements": {}, "employment_types": {}, "wage-ranges": {"as": "wage_ranges"}}', $.i18n._('Unable to load course data.'));

                return data;
            }else{
                $.mobile.navigate('#home');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Free/paid selector
            $('#create-video input[type="radio"][name="price-choice"]').change(function() {
                if ($(this).val() == 'paid')
                    $('#create-video .enter-price').slideDown();
                else
                    $('#create-video .enter-price').slideUp();
            });

            // Init file uploads
            $('#create-video input[name="cover_photo"]').file_upload('image', 'cover_pic', 'video-cover_pic');
            $('#create-video input[name="video"]').file_upload('video', 'raw_video_uri', 'video-video', function(fileuri) {});
            $('#create-video input[name="pdf"]').file_upload('image', 'pdf_uri', 'video-pdf');

            // Autocomplete
            $('.autocomplete').each(function(i, elem) {
                $(elem).core_autocomplete($(this).data('autocomplete-src')+'/autocomplete', function(suggestion) {
                    name = ($(elem).attr('name') == 'location' ? 'region' : $(elem).attr('name'));
                    // Update checkboxes/radios
                    $(elem).closest('.dropdown-container').find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
                    $(elem).closest('.dropdown-container').find('input[name="'+name.replace(/^q_(.*)$/, '$1')+'_id"][value="'+suggestion.data+'"]').prop('checked', true);
                });
            });

            // Add spacer elements to dropdowns
            $('.dropdown-menu.positions li .row:not(.spaced)').each(function(i, elem) {
                $(elem).find('.item:nth-child(3n+1)').after('<div class="four-col">&nbsp;</div>').closest('.row').addClass('spaced');
            });
            $('.dropdown-menu.industries li .row:not(.spaced)').each(function(i, elem) {
                $(elem).find('.item:nth-child(2n+1)').after('<div class="three-col">&nbsp;</div>').closest('.row').addClass('spaced');
            });

            // Toggle
            $('.toggle-content').hide();
            $('.toggle-btn.active').removeClass('active');
            $('.toggle-btn').off('click');
            $('.toggle-btn').on('click', function(e){
                // Close all other toggles
                if (!$(this).hasClass('active'))
                    $('.toggle-btn.active').removeClass('active').next('.toggle-content').slideUp('fast');

                // Toggle
                $(this).toggleClass('active').next('.toggle-content').slideToggle('fast');
                e.preventDefault();
            });

            // Dropdowns
            $('.dropdown-toggle').dropdown();
            $(document).on('click', '.yamm .dropdown-menu', function(e) {
                e.stopPropagation()
            });

            // Update position input upon radio selection
            $('.dropdown-menu.positions input[type="radio"]').off('change');
            $('.dropdown-menu.positions input[type="radio"]').on('change', function(e) {
                selections = {};
                $('.dropdown-menu.positions input[type="radio"]').each(function(i, elem) {
                    if ($(elem).is(':checked')) {
                        group = $(elem).closest('.toggle-content').siblings('.toggle-btn').text().trim();

                        if (typeof(selections[group]) == 'undefined')
                            selections[group] = {};
                        selections[group][$(this).closest('label').text().trim()] = 1;
                    }
                });

                selections_str = $.pages['global']._parse_dropdown_selections(selections);

                $('input[name="position"]').val(selections_str);

                // Close dropdown
                $(this).closest('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); return false;
            });

            // Update industry input upon radio selection
            $('.dropdown-menu.industries input[type="radio"]').off('change');
            $('.dropdown-menu.industries input[type="radio"]').on('change', function(e) {
                selections = {};
                $('.dropdown-menu.industries input[type="radio"]').each(function(i, elem) {
                    if ($(elem).is(':checked')) {
                        group = $(elem).closest('.item').siblings('.group').text().trim();

                        if (typeof(selections[group]) == 'undefined')
                            selections[group] = {};
                        selections[group][$(this).closest('label').text().trim()] = 1;
                    }
                });

                selections_str = $.pages['global']._parse_dropdown_selections(selections);

                $('input[name="industry"]').val(selections_str);

                // Close dropdown
                $(this).closest('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); return false;
            });

            // Update 'single-tier' radio selections
            $.each(['locations', 'experience_requirement', 'education_requirement', 'employment_type'], function(i, thing) {
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

                    // Close dropdown
                    $(this).closest('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); return false;
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
            // Remove 'illegal' fields from POST data
            delete data.position;
            delete data.industry;
            delete data.location;
            delete data.experience_requirement;
            delete data.education_requirement;
            delete data.employment_type;

            return data;
        },

        create_video_cb: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to save your video.')+' '+$.i18n._('Please try again.'));

            // Success
            $.core.show_success($.i18n._('Your video has been saved.'));
//            window.setTimeout("$.mobile.navigate('#video?id="+data.inserts[0]+"');", 1500);
            window.setTimeout("$.mobile.navigate('#videos');", 1500);
        }
    };
};