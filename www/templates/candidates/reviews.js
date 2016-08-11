this_page = function() {
    return {
        get_data: function() {
            data = false;

            // Get mentor data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('multi/?requests={"students/'+id+'": {"as": "candidate", "with": "review-stats"}, "student-reviews/?student_id='+id+'": {"as": "reviews"}}', $.i18n._('Unable to load candidate.'));

            if (!$.isEmptyObject(data))
                return data
            else
                $.mobile.navigate('#candidates');
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        }
    };
};