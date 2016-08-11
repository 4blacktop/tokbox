this_page = function() {
    return {
        get_data: function() {
            error_msg = $.i18n._('Unable to load data.');

            // Get industries from API
            data = $.core.get_from_api('multi/?requests={"positions": {"as-schema": 1}, "industries": {"as-schema": 1}, "regions": {"by_first_letter": 1}, "languages": {}, "wage-ranges": {"as": "wage_ranges"}, "experience_requirements": {}, "availabilities": {}}', error_msg);

            return data;
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Autocomplete
            $('.autocomplete').each(function(i, elem) {
                $(elem).core_autocomplete($(this).data('autocomplete-src')+'/autocomplete', function(suggestion) {
                    name = ($(elem).attr('name') == 'location' ? 'region' : $(elem).attr('name'));
                    // Update checkboxes/radios
                    $(elem).closest('.dropdown-container').find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
                    $(elem).closest('.dropdown-container').find('input[name="'+name+'_id"][value="'+suggestion.data+'"]').prop('checked', true);
                    $(elem).closest('.dropdown-container').find('input[name="'+name+'-'+suggestion.data+'"]').prop('checked', true);
                });
            });

            // Add spacer elements to dropdowns
            $('.dropdown-menu.current_position li .row:not(.spaced), .dropdown-menu.desired_positions li .row:not(.spaced)').each(function(i, elem) {
                $(elem).find('.item:nth-child(3n+1)').after('<div class="four-col">&nbsp;</div>').closest('.row').addClass('spaced');
            });
            $('.dropdown-menu.current_industry li .row:not(.spaced), .dropdown-menu.desired_industries li .row:not(.spaced)').each(function(i, elem) {
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

            // Update current industry input upon radio selection
            $('.dropdown-menu.current_industry input[type="radio"]').off('change');
            $('.dropdown-menu.current_industry input[type="radio"]').on('change', function(e) {
                selections = {};
                $('.dropdown-menu.current_industry input[type="radio"]').each(function(i, elem) {
                    if ($(elem).is(':checked')) {
                        group = $(elem).closest('.item').siblings('.group').text().trim();

                        if (typeof(selections[group]) == 'undefined')
                            selections[group] = {};
                        selections[group][$(this).closest('label').text().trim()] = 1;
                    }
                });

                selections_str = $.pages['global']._parse_dropdown_selections(selections);

                $('input[name="current_industry"]').val(selections_str);

                // Close dropdown
                $(this).closest('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); return false;
            });

            // Update current position input upon radio selection
            $('.dropdown-menu.current_position input[type="radio"]').off('change');
            $('.dropdown-menu.current_position input[type="radio"]').on('change', function(e) {
                selections = {};
                $('.dropdown-menu.current_position input[type="radio"]').each(function(i, elem) {
                    if ($(elem).is(':checked')) {
                        group = $(elem).closest('.toggle-content').siblings('.toggle-btn').text().trim();

                        if (typeof(selections[group]) == 'undefined')
                            selections[group] = {};
                        selections[group][$(this).closest('label').text().trim()] = 1;
                    }
                });

                selections_str = $.pages['global']._parse_dropdown_selections(selections);

                $('input[name="current_position"]').val(selections_str);

                // Close dropdown
                $(this).closest('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); return false;
            });

            // Update desired industries input upon checkbox selection
            $('.dropdown-menu.desired_industries input[type="checkbox"]').off('change');
            $('.dropdown-menu.desired_industries input[type="checkbox"]').on('change', function(e) {
                selections = {};
                $('.dropdown-menu.desired_industries input[type="checkbox"]').each(function(i, elem) {
                    if ($(elem).is(':checked')) {
                        group = $(elem).closest('.item').siblings('.group').text().trim();

                        if (typeof(selections[group]) == 'undefined')
                            selections[group] = {};
                        selections[group][$(this).closest('label').text().trim()] = 1;
                    }
                });

                selections_str = $.pages['global']._parse_dropdown_selections(selections);

                $('input[name="desired_industries"]').val(selections_str);
            });

            // Update desired positions input upon checkbox selection
            $('.dropdown-menu.desired_positions input[type="checkbox"]').off('change');
            $('.dropdown-menu.desired_positions input[type="checkbox"]').on('change', function(e) {
                selections = {};
                $('.dropdown-menu.desired_positions input[type="checkbox"]').each(function(i, elem) {
                    if ($(elem).is(':checked')) {
                        group = $(elem).closest('.toggle-content').siblings('.toggle-btn').text().trim();

                        if (typeof(selections[group]) == 'undefined')
                            selections[group] = {};
                        selections[group][$(this).closest('label').text().trim()] = 1;
                    }
                });

                selections_str = $.pages['global']._parse_dropdown_selections(selections);

                $('input[name="desired_positions"]').val(selections_str);
            });

            // Update desired locations input upon checkbox selection
            $('.dropdown-menu.desired_regions input[type="checkbox"]').off('change');
            $('.dropdown-menu.desired_regions input[type="checkbox"]').on('change', function(e) {
                selections = {};
                $('.dropdown-menu.desired_regions input[type="checkbox"]').each(function(i, elem) {
                    if ($(elem).is(':checked')) {
                        group = $(elem).closest('.toggle-content').siblings('.toggle-btn').text().trim();

                        if (typeof(selections[group]) == 'undefined')
                            selections[group] = {};
                        selections[group][$(this).closest('label').text().trim()] = 1;
                    }
                });

                selections_str = $.pages['global']._parse_dropdown_selections(selections);

                $('input[name="desired_regions"]').val(selections_str);
            });

            // Update 'single-tier' radio selections
            $.each(['desired_wage_range_id', 'languages_spoken'], function(i, thing) {
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
            delete data.current_industry;
            delete data.current_position;
            delete data.desired_industries;
            delete data.desired_positions;
            delete data.desired_regions;
            delete data.languages_spoken;
            $.each(data, function(k, v) {
                if (k.match(/(desired_industries|desired_positions|languages_spoken)-[0-9]*$/))
                    delete data[k];
            });

            // Parse dropdown selections
            $.each(['desired_industries', 'desired_positions', 'desired_regions', 'languages_spoken'], function(i, thing) {
                regexp = new RegExp('^'+thing+'-([0-9]*)$');
                data[thing+'_ids'] = [];
                $.each($('input[type="checkbox"]'), function(i, elem) {
                    k = $(elem).attr('name');
                    if (k.match(regexp)) {
                        id = k.replace(regexp, '$1');

                        if ($(elem).is(':checked')) {
                            data[thing+'_ids'].push(id);
                            data[thing+'-'+id] = 1;
                        }

                        delete data[thing+'-'+id];
                    }
                });
            });

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