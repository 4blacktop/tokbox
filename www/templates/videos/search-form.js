this_page = function() {
    return {
        get_data: function() {
            // Get categories, and upload_token from API
            data = $.core.get_from_api('multi/?requests={"positions": {"as-schema": 1}, "industries": {"as-schema": 1}, "regions": {"by_first_letter": 1}, "experience_requirements": {}, "education_requirements": {}, "company_types": {}, "company_sizes": {}, "employment_types": {}, "wage-ranges": {"as": "wage_ranges"}}', $.i18n._('Unable to load course data.'))

            if (!$.isEmptyObject(data)) {
                data.post = $.core.qs();
                data.posteds = [
                    {id: (60*60*24), name_en: 'Today', name_zh: 'Today'},
                    {id: (60*60*24*3), name_en: 'Last 3 days', name_zh: 'Last 3 days'},
                    {id: (60*60*24*7), name_en: 'Last week', name_zh: 'Last week'},
                    {id: (60*60*24*30), name_en: 'Last month', name_zh: 'Last month'}
                ];
            }

            return data;
        },

        after_load: function() {
            // Autocomplete
            $('.autocomplete').each(function(i, elem) {
                $(elem).core_autocomplete($(this).data('autocomplete-src')+'/autocomplete', function(suggestion) {
                    // Update checkboxes/radios
                    $(elem).closest('.dropdown-container').find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
                    $(elem).closest('.dropdown-container').find('input[name="'+$(elem).attr('name').replace(/^q_(.*)$/, '$1')+'-'+suggestion.data+'"]').prop('checked', true);
                });
            });

            // Add spacer elements to dropdowns
            $('.dropdown-menu.positions li .row:not(.spaced)').each(function(i, elem) {
                $(elem).find('.item:nth-child(3n+1)').after('<div class="four-col">&nbsp;</div>').closest('.row').addClass('spaced');
            });
            $('.dropdown-menu.industries li .row:not(.spaced)').each(function(i, elem) {
                $(elem).find('.item:nth-child(2n+1)').after('<div class="three-col">&nbsp;</div>').closest('.row').addClass('spaced');
            });

            // Dropdowns
            $('.dropdown-toggle').dropdown();
            $(document).on('click', '.yamm .dropdown-menu', function(e) {
                e.stopPropagation()
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

            // Update position input upon checkbox selection
            $('.dropdown-menu.positions input[type="checkbox"]').off('change');
            $('.dropdown-menu.positions input[type="checkbox"]').on('change', function(e) {
                selections = {};
                $('.dropdown-menu.positions input[type="checkbox"]').each(function(i, elem) {
                    if ($(elem).is(':checked')) {
                        group = $(elem).closest('.toggle-content').siblings('.toggle-btn').text().trim();

                        if (typeof(selections[group]) == 'undefined')
                            selections[group] = {};
                        selections[group][$(this).closest('label').text().trim()] = 1;
                    }
                });

                selections_str = $.pages['global']._parse_dropdown_selections(selections);

                $('input[name="q_position"]').val(selections_str);
            });

            // Update industry input upon checkbox selection
            $('.dropdown-menu.industries input[type="checkbox"]').off('change');
            $('.dropdown-menu.industries input[type="checkbox"]').on('change', function(e) {
                selections = {};
                $('.dropdown-menu.industries input[type="checkbox"]').each(function(i, elem) {
                    if ($(elem).is(':checked')) {
                        group = $(elem).closest('.item').siblings('.group').text().trim();

                        if (typeof(selections[group]) == 'undefined')
                            selections[group] = {};
                        selections[group][$(this).closest('label').text().trim()] = 1;
                    }
                });

                selections_str = $.pages['global']._parse_dropdown_selections(selections);

                $('input[name="q_industry"]').val(selections_str);
            });

            // Update 'single-tier' checkbox selections (location, experience
            $.each(['locations', 'experience', 'education_requirements', 'posted', 'company_type', 'company_size', 'employment_type'], function(i, thing) {
                $('.dropdown-menu.'+thing+' input[type="checkbox"]').off('change');
                $('.dropdown-menu.'+thing+' input[type="checkbox"]').on('change', function(e) {
                    selections = {'': {}};
                    $('.dropdown-menu.'+thing+' input[type="checkbox"]').each(function(i, elem) {
                        if ($(elem).is(':checked')) {
                            selections[''][$(this).closest('label').text().trim()] = 1;
                        }
                    });

                    selections_str = $.pages['global']._parse_dropdown_selections(selections);

                    $('input[name="q_'+thing.replace(/s$/, '')+'"]').val(selections_str);
                });
            });

            // Disabled no-input inputs
            $('.dropdown.no-input .dropdown-toggle input[type="text"]').click(function(e) {
                $(this).blur();
            });

            // 'Any' and 'x' buttons handlers
            $('.dropdown a.any').off('click');
            $('.dropdown a.any').click(function(e) {
                $(this).closest('.dropdown-menu').find('input[type="checkbox"]').attr('checked', false);
                $(this).closest('.dropdown').find('input[type="text"]').val('');
                $(this).closest('.dropdown-container').find('input[type="text"]').first().val('');

                e.preventDefault();
                return false;
            });
            $('.dropdown a.x').off('click');
            $('.dropdown a.x').click(function(e) {
                $(this).closest('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); return false;

                e.preventDefault();
                return false;
            });

            // Show advanced search, ITIS
            if ($.core.qs('advanced-search') !== null) {
                $('.advanced-search').show();
                $('.advanced-search-toggles').addClass('advanced');
            }else{
                $('.advanced-search').hide();
                $('.advanced-search-toggles').removeClass('advanced');
            }
        },

        before_submit: function(data) {
            // Show loading
            $.core.show_loading();

            if ($('.advanced-search').is(':visible'))
                data['advanced-search'] = 1;

            // Parse dropdown selections
            $.each(['position', 'industry', 'location', 'experience', 'education_requirement', 'posted', 'company_type', 'company_size', 'employment_type'], function(i, thing) {
                regexp = new RegExp('^'+thing+'-([0-9]*)$');
                $.each($('.search-form input[type="checkbox"]'), function(i, elem) {
                    k = $(elem).attr('name');
                    if (k.match(regexp)) {
                        id = k.replace(regexp, '$1');

                        if ($(elem).is(':checked'))
                            data['q_'+thing+'-'+id] = 1;

                        delete data[thing+'-'+id];
                    }
                });
            });

            // Go to search results
            uri = '#videos?'+$.param(data);
            $.core.redirect(uri);
            return false;
        }
    };
};