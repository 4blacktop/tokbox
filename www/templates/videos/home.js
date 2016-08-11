this_page = function() {
    return {
        get_data: function() {
            error_msg = $.i18n._('Unable to load job data.');

            // Get data from API
            if ($.core.qs('q') !== null) {
                // Get search results
                startrecord = (typeof($.core.qs('startrecord')) != 'undefined' && parseInt($.core.qs('startrecord')) ? parseInt($.core.qs('startrecord')) : 1);
                data = $.pages['videos.home'].get_search_results(startrecord);
            }else{
                // Load landing page data
                data = {is_search: false};
                data.videos = $.core.get_from_api('multi/?requests={"videos/popular": {"as": "popular"}, "videos/recommended": {"as": "recommended"}, "videos/viewed": {"as": "viewed"}, "videos/new": {"as": "new"}}', error_msg);
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
            data.videos = $.core.get_from_api('videos/?'+$.param($.core.qs())+'&numrecords='+numrecords+'&startrecord='+startrecord, null, function(){}, {return_meta: true});

            return data;
        },

        after_load: function() {
            $.core.flipsnap('#videos-popular');
            $.core.flipsnap('#videos-recommended');
            $.core.flipsnap('#videos-viewed');
            $.core.flipsnap('#videos-new');
        },

        append_results: function(qs, startrecord) {
            $.search_results = $.pages['videos.home'].get_search_results(startrecord, qs);

            $.ajax({
                url: $.handlebars_templates_base_path+'videos/item.handlebars.html',
                cache: false,
                success: function(response) {
                    // Compile and register partial
                    template = Handlebars.compile(response);
                    Handlebars.registerPartial('video', response);

                    $.ajax({
                        url: $.handlebars_templates_base_path+'videos/list.handlebars.html',
                        cache: false,
                        success: function(response) {
                            // Load page
                            $('#videos .videos > div').load_template_manually('videos/list.handlebars.html', $.search_results, function() {
                                // Update Show more link
                                if ($.search_results.videos.meta.NumRecordsAvailable <= $.search_results.videos.meta.EndRecord) {
                                    $('#videos .show-more a').hide();
                                }else{
                                    $('#videos .show-more a').attr('href', '#videos?'+$.search_results.qs+'&append_results=1&startrecord='+$.search_results.nextrecord);
                                    $('#videos .show-more a').attr('onclick', "$.pages['videos.home'].append_results('"+$.search_results.qs+"', "+$.search_results.nextrecord+"); return false;");
                                }
                            }, true);
                        }
                    });
                }
            });
        }
    };
};