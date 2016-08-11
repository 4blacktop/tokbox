this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load location.');

            // Get mentor data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('multi/?requests={"regions/'+id+'/": {"as": "location", "with": "members"}, "banner-ads": {"as": "banner_ads", "by": "size", "with": "videos"}, "videos/popular": {"as": "popular_videos"}, "videos/featured": {"as": "featured_videos"}, "mentors/popular": {"as": "popular_mentors"}, "regions": {"by_first_letter": 1}}', error_msg);
            else
                $.core.show_error(error_msg);


            if (!$.isEmptyObject(data)) {
/* START TEMP DATA */
data.letters = [{letter:'a'},{letter:'b'},{letter:'c'},{letter:'d'},{letter:'e'},{letter:'f'},{letter:'g'},{letter:'h'},{letter:'i'},{letter:'j'},{letter:'k'},{letter:'l'},{letter:'m'},{letter:'n'},{letter:'o'},{letter:'p'},{letter:'q'},{letter:'r'},{letter:'s'},{letter:'t'},{letter:'u'},{letter:'v'},{letter:'w'},{letter:'x'},{letter:'y'},{letter:'z'}];
/* END TEMP DATA */

                return data;
            }else{
                $.mobile.navigate('#home');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            // Flipsnap
            $.core.flipsnap('#region-members');
            $.core.flipsnap('#home-videos-popular');
            $.core.flipsnap('#home-mentors-popular');
            $.core.flipsnap('#home-videos-featured');
        }
    };
};