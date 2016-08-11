this_page = function() {
    return {
        get_data: function() {
            data = $.core.get_from_api('multi/?requests={"banner-ads": {"as": "banner_ads", "by": "size", "with": "videos"}, "industries-tier-2": {"as": "industry_categories"}, "positions": {"as": "filter_letters", "by_pinyin_first_letter": 1}, "videos/popular": {"as": "popular_videos"}, "videos/featured": {"as": "featured_videos"}, "mentors/popular": {"as": "popular_mentors"}, "regions": {"by_first_letter": 1}}', $.i18n._('Unable to load your data.'));

            return data;
        },

        after_load: function() {
            // Flipsnaps
            $.core.flipsnap('#home-videos-popular');
            $.core.flipsnap('#home-mentors-popular');
            $.core.flipsnap('#home-videos-featured');

            // Flexslider
            $('#flexslider').flexslider({
                animation: "slide",
                smoothHeight: true,
                touch: true,
                controlNav: false,
                directionNav: false,
                prevText: '',
                nextText: '',
                slideshowSpeed: 5000
            });

            // Setup click toggles
            clickToggle('#nav-btn', 'nav-trigger');
            clickToggle('#search', 'search-trigger');
            clickToggle('#category-filter', 'filter-trigger');

            // Close filter once link is clicked
            $('.category-filter a').click(function(event) {
                $('html').removeClass('filter-trigger');
            });

            // Hide show password
            $('#password').hideShowPassword(false, true);

            // Category filter
            var stickyNavOffsetTop = $('.main-header').innerHeight() + $('.bg-welcome').innerHeight();
            var pageHome = $('#home');

            var stickyNavigation = function(){
                var scrollTop = $(window).scrollTop(); 

                if (scrollTop > stickyNavOffsetTop) { 
                    pageHome.addClass('sticky');  
                } else {
                    pageHome.removeClass('sticky');
                }   
            };

            // run our function on load
            stickyNavigation();

            // and run it again every time you scroll
            $(window).scroll(function() {
                stickyNavigation();
            });

            // Activate links
            $('.category-filter-nav a').click(function(e) {
                target_cat = $(this).data('cat');
                if (target_cat > 0) {
                    $('.category-filter-nav a').removeClass('active');
                    $(this).addClass('active');

                    target_class = 'cat-'+$(this).data('cat');
                    $('.banner').addClass('unhighlight');
                    $('.banner').removeClass('highlight');
                    $('.banner.'+target_class).removeClass('unhighlight');
                    $('.banner.'+target_class).addClass('highlight');
                }else{
                    $('.category-filter-nav a').removeClass('active');

                    $('.banner').removeClass('unhighlight');
                    $('.banner').removeClass('highlight');
               }

                e.preventDefault();
                return false;
            });
        }
    };
};