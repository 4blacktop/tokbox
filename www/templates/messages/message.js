this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load message.');

            // Get user data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('messages/'+id, error_msg);
            else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                // Mark message as read
                if (!data.read_at || $.core.qs('reply_id')) {
                    $.core.put_to_api('messages/'+id, {}, null, function(response) {
                        // Mark message as read in inbox
                        $('#message-'+id).removeClass('messageUnread').addClass('messageRead');
                    });

                    // Update num_unread in slide out
                    $.core.update_header();
                }

                return data;
            }else{
                $.mobile.navigate('#inbox');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        },

        reply_cb: function(response) {
            success = false;
            try {
                response = $.parseJSON(response.responseText);

                if (typeof(response.inserts) != 'undefined')
                    if (response.inserts.length) {
                        success = true;

                        response = response.inserts[0];
                    }
            }catch (e) {
            }

            if (success) {
                // Add reply to DOM
                reply = $('.messageThread').eq(0).clone();

                $(reply).find('.messagePic').css('background-image', 'url("'+response.from_profile_pic+'")').attr('alt', response.from_name);
                $(reply).find('.messageFromName').text(response.from_name);
                $(reply).find('.messageToName').text(response.to_name);
                $(reply).find('.messageTime').text(response.created_at_human);
                $(reply).find('.messageContent p').html(response.message);
                $(reply).show();

                $('.replies').append(reply);

                $('#reply-form textarea[name="message"]').val('');
            }else
                $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to save your reply.'));
        }
    };
};