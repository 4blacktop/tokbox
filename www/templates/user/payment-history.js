this_page = function() {
    return {
        get_data: function() {
            // Get user data
            data = $.core.get_from_api('multi/?requests={"payments/mine/made": {"as": "made"}, "payments/mine/received": {"as": "received"}}', $.i18n._('Unable to load your payment data.'));

            if (!$.isEmptyObject(data))
                return data;
            else
                $.mobile.navigate('#home');
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        }
    };
};