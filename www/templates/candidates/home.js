this_page = function() {
    return {
        get_data: function() {
            error_msg = $.i18n._('Unable to load candidates data.');

            // Get data from API
            if ($.core.qs('q') !== null) {
                // Get search results
                startrecord = (typeof($.core.qs('startrecord')) != 'undefined' && parseInt($.core.qs('startrecord')) ? parseInt($.core.qs('startrecord')) : 1);
                data = $.pages['candidates.home'].get_search_results(startrecord);
            }else{
                // Load landing page data
                data = {is_search: false};
                data.users = $.core.get_from_api('multi/?requests={"students/popular": {"as": "popular"}, "students/recommended": {"as": "recommended"}, "students/new": {"as": "new"}}', error_msg);
            }

            return data;
        },

        get_search_results: function(startrecord, qs) {
            // Derive startrecord
            numrecords = 20;
            startrecord = (typeof(startrecord) != 'undefined' && parseInt(startrecord) ? parseInt(startrecord) : 1);

            // Load search results data
            qs = (typeof(qs) != 'undefined' ? qs : null);
            if (typeof(qs) == 'string')
                try {
                    qs = JSON.parse('{"' + decodeURI(qs).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
                }catch(err) {
                    qs = null;
                }
            if (!qs)
                qs = $.core.qs();

            delete qs.startrecord;
            data = {is_search: true, post: qs, qs: $.param(qs), nextrecord: (startrecord+numrecords)};
            data.users = $.core.get_from_api('students/?'+$.param($.core.qs())+'&numrecords='+numrecords+'&startrecord='+startrecord, null, function(){}, {return_meta: true});

            return data;
        },

        after_load: function() {
            $.core.flipsnap('#candidates-popular');
            $.core.flipsnap('#candidates-recommended');
            $.core.flipsnap('#candidates-new');
        },

        append_results: function(qs, startrecord) {
            $.search_results = $.pages['candidates.home'].get_search_results(startrecord, qs);

            $.ajax({
                url: $.handlebars_templates_base_path+'candidates/item.handlebars.html',
                cache: false,
                success: function(response) {
                    // Compile and register partial
                    template = Handlebars.compile(response);
                    Handlebars.registerPartial('candidate', response);

                    $.ajax({
                        url: $.handlebars_templates_base_path+'candidates/list.handlebars.html',
                        cache: false,
                        success: function(response) {
                            // Load page
                            $('#candidates .candidates > div').load_template_manually('candidates/list.handlebars.html', $.search_results, function() {
                                // Update Show more link
                                if ($.search_results.users.meta.NumRecordsAvailable <= $.search_results.users.meta.EndRecord) {
                                    $('#candidates .show-more a').hide();
                                }else{
                                    $('#candidates .show-more a').attr('href', '#candidates?'+$.search_results.qs+'&append_results=1&startrecord='+$.search_results.nextrecord);
                                    $('#candidates .show-more a').attr('onclick', "$.pages['candidates.home'].append_results('"+$.search_results.qs+"', "+$.search_results.nextrecord+"); return false;");
                                }
                            }, true);
                        }
                    });
                }
            });
        }
    };
};