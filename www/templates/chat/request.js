this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load mentor.');

            // Get user data
            id = $.core.qs('mentor_id');
            if (id)
                data = $.core.get_from_api('mentors/'+id, error_msg);
            else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                $.mentor_price_rmb = data.one_on_one_price_rmb;

                return {mentor: data};
            }else{
                $.mobile.navigate('#mentors');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Set default date/time
            tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            tomorrow_val = tomorrow.getFullYear() + '-' + ('0' + (tomorrow.getMonth()+1)).slice(-2) + '-' + ('0' + tomorrow.getDate()).slice(-2);
            $('#request-one-on-one #start_date, #request-one-on-one #end_date').val(tomorrow_val);
            $('#request-one-on-one #start_time').val('10:00');
            $('#request-one-on-one #end_time').val('10:30');

            // Update total price
            $.pages['chat.request'].update_total_price();
            $('#request-one-on-one #start_date, #request-one-on-one #end_date, #request-one-on-one #start_time, #request-one-on-one #end_time').change(function() {
                $.pages['chat.request'].update_total_price();
            });
        },

        update_total_price: function() {
            start_unix = new Date($('#request-one-on-one #start_date').val() +' '+ $('#request-one-on-one #start_time').val()).getTime();
            end_unix = new Date($('#request-one-on-one #end_date').val() +' '+ $('#request-one-on-one #end_time').val()).getTime();
            duration = end_unix - start_unix;

            // Calculate price
            if (duration > 0 && (duration / 1000 / 60) % 30 == 0)
                total_price = '¥' + ((duration / 1000 / 60 / 30) * $.mentor_price_rmb);
            else
                total_price = '[invalid]';

            // Update display
            $('#request-one-on-one #total_price').text(total_price);
        },

        after_submit: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to save your request.')+' '+$.i18n._('Please try again.'));

            success = false;
            if (typeof(data.inserts) != 'undefined')
                if (data.inserts.length)
                    success = true;

            if (success) {
                $.core.show_success($.i18n._('Your request has been sent.'));

                // Go back
                window.setTimeout("$.core.history.go(-1);", 1500);
            }else
                $.core.show_error($.i18n._('Oops!')+' '+$.i18n._('Unable to send your request.'));
        }
    };
};