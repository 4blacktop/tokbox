// Toggle function
function clickToggle(selectedEl, toggledClass) {
    $(selectedEl).off('click');
    $(selectedEl).on('click', function() {
        $('html').toggleClass(toggledClass);
    });
}

function ready() {
    // Hide show password
    $('#password').hideShowPassword(false, true);
}

if (typeof($.core) != 'undefined') {
    // Set API site-wide auth
    $.core.api_auth_user = 'dapinqing';
    $.core.api_auth_password = 'qBxR%Hj*&f9BiqtePgH+I,7D_3pCbZ|';

    // Debug/dev/staging modues
    $.core.debug_mode = false;              // Set to true to output debug information to console
    $.core.dev_mode = false;                 // Set to true to use dev API source when in native app mode
    $.core.staging_mode = false;            // Set to true to use staging API source when in native app mode (overrides dev_mode if true)

    // General config
    $.core.app_available = false;            // If set to true, interface will suggest downloading the app version when a mobile screen size is detected and we are not already running the app

    // Set up logout cb
    $.core.logout_cb = function(message_id) {
        // Redirect
        redir = $.core.sanitize_uri('#home', 'locb='+message_id);
        $.core.redirect(redir);
    };

    // Init Core
    $.core.init(function() {});

    // Init jQuery.mobile
    $.jqmobile_loader.init({
        after_header_loaded: function() {
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
        }
    });
}else{
    ready();
}
