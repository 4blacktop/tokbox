this_page = function() {
    return {
        get_data: function() {
            data = {};

            // Get request data
            data = $.core.get_from_api('circle/pending', null);

            // Mark requests as read
            $.core.put_to_api('circle/pending/?mark-as-read', {}, null, function(response) {
                // Mark message as read in inbox
                $('#circle-requests .circle-requests .item').addClass('read');
            });

            // Update num_unread in tab bar
            $.core.update_footer();

            return data;
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        },

        respond: function(action, id) {
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
                        $.core.show_success($.i18n._('Request')+' '+(action == 'accept' ? $.i18n._('accepted') : $.i18n._('denied'))+'.');

                        // Remove request on-screen
                        $('#circle-request-'+id).slideUp(250, function() {
                            $(this).remove();
                        });
                    }else
                        $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to update that request.'));
                });
            }else
                $.core.show_error($.i18n._('An error has occurred.'));
        }
    };
};