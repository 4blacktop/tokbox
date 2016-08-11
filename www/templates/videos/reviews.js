this_page = function() {
    return {
        get_data: function() {
            data = false;

            // Get video data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('multi/?requests={"videos/'+id+'": {"as": "video", "with": "review-stats"}, "video-reviews/?video_id='+id+'": {"as": "reviews"}, "users_videos/'+id+'": {"as": "enrollment"}}', $.i18n._('Unable to load course.'));

            if (!$.isEmptyObject(data.video))
                return data;
            else
                $.mobile.navigate('#videos');
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();
        }
    };
};