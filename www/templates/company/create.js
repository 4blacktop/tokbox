this_page = function() {
    return {
        get_data: function() {
            // Prevent access if user already has a company
            company = $.core.get_from_api('companies/mine', null);

            if (!$.isEmptyObject(company))
                $.mobile.navigate('#my-company');

            return true;
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Init file upload
            $('#create-company input[name="cover_photo"]').file_upload('image', 'profile_pic', 'company-profile_pic', function(fileuri) {});
        },

        after_submit: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to save your company.')+' '+$.i18n._('Please try again.'));

            // Success
            $.core.show_success($.i18n._('Your company has been saved.'));
            window.setTimeout("$.core.history.go(-1);", 1500);
        }
    };
};