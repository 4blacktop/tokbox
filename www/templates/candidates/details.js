this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load candidate.');

            // Get user data
            id = $.core.qs('id');
            if (id) {
                data.user = $.core.get_from_api('students/'+id+'?with=job_desires,relationship-data', error_msg);        
            }else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                $.user_data = data;

                return data;
            }else
                $.mobile.navigate('#candidates');
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
                if (typeof($.user_data) == 'undefined')
                    return;
                if (typeof($.user_data.user) == 'undefined')
                    return;

                // Stash id
                $.video_player.video_id = $.user_data.user.id;

                // Load video into DOM
                if (!$.user_data.user.video_uri)
                    return;
                $(this).append('<video id="video-video" class="video" style="width: 100%;" autobuffer controls="false" poster="'+$.user_data.user.profile_pic+'"><source src="'+$.user_data.user.video_uri+'" type="video/mp4"></video>');

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
            $('.user-video-container').init_video();
        },

        request(type, id) {
            success = false;
            $.core.post_to_api('circle/', {their_user_id: id, relationship_type: type}, null, function(response) {
                try {
                    response = $.parseJSON(response.responseText);

                    if (typeof(response.inserts) != 'undefined')
                        if (response.inserts.length) {
                            success = true;

                            response = response.inserts[0];
                        }
                }catch (e) {}

                if (success) {
                    $.core.show_success($.i18n._('You have been charged one contact credit, and may now contact this candidate.'));

                    // Update DOM
                    window.setTimeout('$.core.reload();', 1500);
                }else{
                    if (typeof(response.error) != 'undefined') {
                        if (response.error.MoreInfo != '')
                            error_msg = response.error.MoreInfo;
                        else
                            error_msg = $.i18n._('Oops!')+' '+$.i18n._('Unable to contact candidate.');
                    }
                    $.core.show_error(error_msg);
                }
            });
        },

        respond_to_request(action, id, type, btn1, btn2) {
            if (action == 'accept' || action == 'deny') {
                success = false;
                $.core.put_to_api('circle/'+id+'/?'+action, {}, null, function(response) {
                    try {
                        response = $.parseJSON(response.responseText);

                        if (typeof(response.updates) != 'undefined')
                            if (response.updates.length) {
                                success = true;

                                response = response.updates[0];
                            }
                    }catch (e) {}

                    if (success) {
                        $.core.show_success(type.charAt(0).toUpperCase()+(type == 'protege' ? 'rotégé' : type.slice(1))+' '+$.i18n._('request')+' '+(action == 'accept' ? $.i18n._('accepted') : $.i18n._('denied'))+'.');

                        // Update buttons
                        if (action == 'deny') {
                            $(btn1).parent().remove();
                        }else{
                            $(btn2).remove();
                            $(btn1).removeClass('checkmark').removeClass('x').addClass('disabled').addClass(type == 'protege' ? 'checkmark' : 'smiley').text(type == 'protege' ? $.i18n._('Your protégé') : $.i18n._('Friends')).attr('onclick', 'return false');
                        }
                    }else
                        $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to update that request.'));
                });
            }else
                $.core.show_error($.i18n._('An error has occurred.'));
        }
    };
};