this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load job listing.');

            // Get video data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('multi/?requests={"videos/'+id+'": {"as": "video"}, "users/me": {"as": "me"}}', error_msg);
            else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                $.my_data = data.me;

                return data;
            }else
                $.mobile.navigate('#videos');
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

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
            $('.response-video-container').init_video();
        },

        after_submit: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to save your application.')+' '+$.i18n._('Please try again.'));

            // Success
            $.core.show_success($.i18n._('Your application has been saved.'));
            window.setTimeout("$.core.history.go(-1);", 1500);
        }
    };
};