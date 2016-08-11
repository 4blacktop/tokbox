this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load job.');

            // Get video data
            id = $.core.qs('id');
            if (id) {
                video = $.core.get_from_api('videos/'+id, error_msg);
                if (!$.isEmptyObject(video)) {
                    data = $.core.get_from_api('multi/?requests={"video-responses?video_id='+id+'": {"as": "responses"}, "videos/by-mentor/?mentor_id='+video.mentor_id+'": {"as": "related", "not_id": '+id+'}, "users_videos/'+id+'?session_id='+video.session_id+'": {"as": "enrollment"}}', null);
                    data.video = video;
                }
            }
console.log(data);

            if (!$.isEmptyObject(data.video)) {
                // Make data available to script
                $.video_data = data;

                return data;
            }else{
                $.core.show_error(error_msg);

                $.mobile.navigate('#videos');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Flipsnap
            $.core.flipsnap('#video-related');

            $.video_player = {
                video_id: null,
                player: null,
                player_id: null,
                is_ready: false,
                is_playing: false,
                is_seeking: false,
                duration: null,
                last_index: 0,
                update_api_interval: 10
            };

            $.fn.init_video = function() {
                if (typeof($.video_data) == 'undefined')
                    return;
                if (typeof($.video_data.video) == 'undefined')
                    return;

                // Stash id
                $.video_player.video_id = $.video_data.video.id;

                // Security - Verify sesion_id and retrieve video token
                $.core.put_to_api('users_videos/'+$.video_player.video_id, {session_id: $.video_data.video.session_id}, $.i18n._('Unable to verify video security.'), $.video_player._init_video($(this)));
            };

            $.video_player._init_video = function(elem) {
                return function(response) {
                    data = $.core.parse_api_response(response);
                    if (!data) {
                        $(elem).remove_video();
                    }else{
                        // Add video_token and session_id to video_uri
                        $.video_data.video.video_uri = $.video_data.video.video_uri + data.video_token + '/' + data.session_id;

                        if (!$.video_data.video.video_uri)
                            return;
                        $(elem).append('<video id="video-video" class="video" style="width: 100%;" autobuffer controls="false" poster="'+$.video_data.video.cover_pic+'"><source src="'+$.video_data.video.video_uri+'" type="video/mp4"></video>');

                        // Grab DOM stuff
                        $.video_player.player = $(elem).find('video');
                        $.video_player.player_id = $.video_player.player.attr('id');

                        // Seek to last_index
                        if (typeof($.video_data.enrollment.last_index) != 'undefined' && parseInt($.video_data.enrollment.last_index) > 0)
                            $.video_player.seek_to($.video_data.enrollment.last_index);

                        // Start stats listener
                        $.video_player.player.bind('canplay', function() { $.video_player.update_stats(); });
                        $.video_player.player.bind('play', function() {
                            $.video_player.is_playing = true;

                            // Enforce landscape orientation
/*
alert('gon lock');
screen.lockOrientation('landscape');
alert('screen locked');
                            if (typeof(cordova) != 'undefined') {
                                var so = cordova.plugins.screenorientation;
                                so.setOrientation(so.Orientation.LANDSCAPE);
                            }
*/

                            $.video_player.update_api({session_id: $.video_data.video.session_id});

                            $.video_player.update_stats();
                        });
                        $.video_player.player.bind('canplay', function() { $.video_player.update_stats(); });
                        $.video_player.player.bind('timeupdate', function() { $.video_player.update_stats(); });
                        $.video_player.player.bind('ended', function() {
                            $.video_player.is_playing = false;
                            $.video_player.update_stats(); 
                        });
                        $.video_player.player.bind('pause', function() {
                            $.video_player.is_playing = false;
                            $.video_player.update_stats();
                        });

                        $(document).on('orientationchange', function(e) {       
/*
                            if (!e.currentTarget.webkitIsFullScreen) {
                                var so = cordova.plugins.screenorientation;
                                so.setOrientation(so.Orientation.PORTRAIT);
                            }
*/
                        });                        
                    }
                };
            };
            $.fn.remove_video = function() {
                $(this).html('<img src="app-core/assets/images/invalid-video.png" alt="Invalid Video" style="display: block; max-width: 100%; max-height: 200px; margin: 0 auto;">');
            };

            $.video_player.update_api = function(data) {
                // Gather data
                data = (typeof(data) == 'object' ? data : {});

                // Only execute if last_index has changed
                data.last_index = (typeof(data.currentTime) != 'undefined' ? data.currentTime : $.video_player.player[0].currentTime);
                if (data.last_index >= 0 && data.last_index != $.video_player.last_index) {
                    $.video_player.last_index = data.last_index;

                    // Update the API
                    $.video_player._update_api(data);
                }else{
                    // Try again
                    if ($.video_player.is_playing)
                        window.setTimeout("$.video_player.update_api({session_id: '"+data.session_id+"'});", $.video_player.update_api_interval*1000);
                }
            };
            $.video_player._update_api = function(data) {
                // Update the API
                $.core.api('put', 'users_videos/'+$.video_player.video_id, data, $.i18n._('Unable to verify video security.'), $.video_player._update_api_cb(data));
            };
            $.video_player._update_api_cb = function(data) {
                return function(response) {
                    // If no response was received, ignore. This indicates a lost network connection/packet - do we don't want to honor it as security invalidation
                    if (response.status == 0) {
                        session_id = data.session_id;
                    }else{
                        response = $.core.parse_api_response(response);
                        if (response)
                            session_id = response.session_id;
                    }

                    // Restart poll, or fail due to security invalidation
                    if (response) {
                        if ($.video_player.is_playing)
                            window.setTimeout("$.video_player.update_api({session_id: '"+session_id+"'});", $.video_player.update_api_interval*1000);
                    }else{
                        $('.video-video-container').remove_video();
                    }
                };
            };

            $.video_player.seek_to = function(time) {
                // Lock
                if ($.video_player.is_seeking)
                    return;
                $.video_player.is_seeking = true;

                // Var protection
                if (!parseInt(time))
                    return false;
                time = parseInt(time);

                $.video_player._seek_to(time);
            };
            $.video_player._seek_to = function(time, secondary) {
                secondary = (typeof(secondary) == 'undefined' ? false : secondary);

                // Attempt an out-of-the-gate seek. This seems to improve performance on some devices, while it has no affect on others
/*
                if (!secondary)
                    $.video_player.player[0].currentTime = time;
*/

                // Wait for player to load, and for the seek_to time to be seekable
                is_seekable = false;
                for (var i=0; i < $.video_player.player[0].seekable.length; i++) {
                    if (time >= $.video_player.player[0].seekable.start(i) && time < $.video_player.player[0].seekable.end(i))
                        is_seekable = true;
                }
                if (!$.video_player.is_ready || !is_seekable) {
                    window.setTimeout("$.video_player._seek_to("+time+", true);", 1000);
                    return;
                }

                // Perform actual seek
                $.video_player.player[0].currentTime = time;

                $.video_player.is_seeking = false;
            };

            $.video_player.update_stats = function() {
                // Set is_ready
                $('.video-stats .is-ready').html('No');
                if (typeof $.video_player.player[0].readyState != 'undefined')
                    if ($.video_player.player[0].readyState > 0)
                        $.video_player.is_ready = true;
                if (!$.video_player.is_ready)
                    return;
                $('.video-stats .is-ready').html('Yes');

                // Set duration
                $.video_player.duration = $.video_player.player[0].duration;
                $.video_player.duration = (typeof $.video_player.duration == 'undefined' ? 'undefined' : $.video_player.duration);
                if ($.video_player.duration > 0)
                    $('.video-stats .duration').html($.video_player.duration);

                // Set is_playing
                $('.video-stats .is-playing').html($.video_player.is_playing ? 'Yes' : 'No');

                // Set current time
                currentTime = $.video_player.player[0].currentTime;
                currentTime = (typeof currentTime == 'undefined' ? 'undefined' : currentTime);
                if (currentTime > 0)
                    $('.video-stats .currentTime').html(currentTime);
            };

            // Go...
            $('.video-video-container').init_video();
        },

        enroll: function() {
            data = {video_id: $.video_data.video.id};

            // Hit the API
            response = $.core.post_to_api('video-enrollment/', data, $.i18n._('Unable to enroll you in this job.'));

            // Parse response
            if (typeof(response.success) != 'undefined' && response.success) {
                $.core.show_success($.i18n._('You are now enrolled in this job.')+' '+$.i18n._('Refreshing...'));

                window.setTimeout("$.core.reload();", 1500);
            }
        }
    };
};