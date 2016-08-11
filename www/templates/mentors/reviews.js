this_page = function() {
    return {
        get_data: function() {
            data = false;

            // Get mentor data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('multi/?requests={"mentors/'+id+'": {"as": "mentor", "with": "review-stats"}, "mentor-reviews/?mentor_id='+id+'": {"as": "reviews"}}', $.i18n._('Unable to load mentor.'));

            if (!$.isEmptyObject(data))
                return data
            else
                $.mobile.navigate('#mentors');
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        }
    };
};