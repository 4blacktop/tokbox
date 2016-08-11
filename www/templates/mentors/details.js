this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load mentor.');

            // Get mentor data
            id = $.core.qs('id');
            if (id) {
                data.mentor = $.core.get_from_api('mentors/'+id, error_msg);        
                if (!$.isEmptyObject(data.mentor))
                    data.videos = $.core.get_from_api('videos/by-mentor/?mentor_id='+data.mentor.id, null);
            }else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                $.mentor_data = data;

                return data;
            }else
                $.mobile.navigate('#mentors');
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Flipsnap
            $.core.flipsnap('#mentor-videos');

            $.video_player = {
                video_id: null,
                player: null,
                player_id: null,
                is_ready: false,
                is_playing: false,
                is_seeking: false
            };

            $.fn.init_video = function() {
                if (typeof($.mentor_data) == 'undefined')
                    return;
                if (typeof($.mentor_data.mentor) == 'undefined')
                    return;

                // Stash id
                $.video_player.video_id = $.mentor_data.mentor.id;

                // Load video into DOM
                if (!$.mentor_data.mentor.video_uri)
                    return;
                $(this).append('<video id="video-video" class="video" style="width: 100%;" autobuffer controls="false" poster="'+$.mentor_data.mentor.profile_pic+'"><source src="'+$.mentor_data.mentor.video_uri+'" type="video/mp4"></video>');

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
            $('.mentor-video-container').init_video();
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
                    $.core.show_success($.i18n._('Your request has been sent.'));

                    // Update button
                    $('#request-'+type).removeClass('smiley').removeClass('mentor').addClass('waiting').addClass('disabled').text(type.charAt(0).toUpperCase()+type.slice(1)+' '+$.i18n._('request sent')).attr('onclick', 'return false');
                }else
                    $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to send your request.'));
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