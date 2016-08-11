this_page = function() {
    return {
        poll_interval: 5000,

        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load 1-on-1 session.');

            // Get user data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('1-on-1-sessions/'+id, error_msg);
            else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                // Mark messages as read
                $.core.put_to_api('1-on-1-sessions/'+id+'?mark-messages-as-read', {}, null);

                return data;
            }else{
                $.mobile.navigate('#one-on-one-requests');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Grab id
            id = $('#vars').data('id');

            if (id) {
                // Poll for new messages
                window.setTimeout("$.pages['chat.chat'].update_messages("+id+");", $.pages['chat.chat'].poll_interval);
            }

            // Force send button to work
            $('#one-on-one #chat-form input[type="submit"]').on('touchstart', function(e) {
                $('#one-on-one #chat-form').submit();
                e.stopPropagation();
                return false;
            });

            // Scroll to bottom
            $('html, body').scrollTop($(document).height());
        },

        update_messages: function(id) {
            if (id) {
                // Get unread messages
                data = $.core.get_from_api('1-on-1-messages/?session_id='+id+'&type=theirs&unread=true', null);

                if (!$.isEmptyObject(data)) {
                    // Mark messages as read
                    $.core.put_to_api('1-on-1-sessions/'+id+'?mark-messages-as-read', {}, null);

                    for (i=0; i<data.length; i++) {
                        // Add new message(s) DOM
                        $.pages['chat.chat'].add_message('theirs', data[i].message, data[i].created_at);
                    }
                }
            }

            // Do it again!
            window.setTimeout("$.pages['chat.chat'].update_messages("+id+");", $.pages['chat.chat'].poll_interval);
        },

        before_submit: function() {
            if (!$.trim($('#one-on-one textarea[name="message"]').val()))
                return false;
        },

        after_submit: function(response) {
            success = false;
            try {
                response = $.parseJSON(response.responseText);

                if (typeof(response.inserts) != 'undefined')
                    if (response.inserts.length) {
                        success = true;

                        response = response.inserts[0];
                    }
            }catch (e) {}

            if (success) {
                // Clear input
                $('#one-on-one #message').val('');
                $('#one-on-one #message').blur();
                $('#one-on-one #message').height('20px');

                // Add message to DOM
                $.pages['chat.chat'].add_message('mine', response.message, response.created_at);
            }else
                $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to send your message.'));
        },

        add_message: function(type, content, time) {
            // Add message to DOM
            message = $('#chat .message').eq(0).clone();

            $(message).removeClass('theirs').removeClass('mine').addClass(type).data('time', time);
            $(message).text(content);
            $(message).show();

            $('#chat .message').last().after(message);

            // Scroll to bottom
            $('html, body').scrollTop($(document).height());
        }
    };
};