this_page = function() {
    return {
        get_data: function() {
            data = {};
            error_msg = $.i18n._('Unable to load course.');

            // Get video data
            id = $.core.qs('id');
            if (id)
                data = $.core.get_from_api('videos/'+id, error_msg);
            else
                $.core.show_error(error_msg);

            if (!$.isEmptyObject(data)) {
                data.is_mobile = $.core.is_mobile;

                return data;
            }else{
                $.mobile.navigate('#videos');
            }
        },

        after_load: function() {
            // Show back button
            $.core.show_back_arrow();

            $('input[type="radio"][name="payment-choice"]').change(function() {
                if ($(this).val() == 'new-method')
                    $('.enter-new-method').slideDown();
                else
                    $('.enter-new-method').slideUp();
            });
/*
            data = false;

              var paymentForm = {
  
              init: function() {
                // kick it off once, in case the radio is already checked when the page loads
                this.applyConditionalRequired();
                this.bindUIActions();
              },
              
              bindUIActions: function() {
                // when a radio or checkbox changes value, click or otherwise
                $("input[type='radio'], input[type='checkbox']").on("change", this.applyConditionalRequired);
              },
              
              applyConditionalRequired: function() {
                // find each input that may be hidden or not
                $(".require-if-active").each(function() {
                  var el = $(this);
                  // find the pairing radio or checkbox
                  if ($(el.data("require-pair")).is(":checked")) {
                    // if its checked, the field should be required
                    el.prop("required", true);
                  } else {
                    // otherwise it should not
                    el.prop("required", false);
                  }
                });
              }

            };

            paymentForm.init();
*/
        },

        after_submit: function(response) {
            data = $.core.parse_api_response(response);
            if (!data)
                return $.core.api_error(response, $.i18n._('Unable to make your payment.')+' '+$.i18n._('Please try again.'));

            // Success

/*
$('html').html(data.inserts[0].html);
$('form#alipaysubmit').submit();
return;
*/


            // Show loading indicator
            $('#video-pay-form input.submit').parent().hide();;
            $('#video-pay-form img.loading').show();

            // Show AliPay
            $('#content-overlay').html('<iframe id="alipay-response"></iframe>');
            $('#alipay-response').contents().find('html').html(data.inserts[0].html);
            $('#alipay-response').contents().find('form#alipaysubmit').submit();
            $('#alipay-response').on('load', function() {
                $.core.show_content_overlay(function() {
                    $('#alipay-response').css({height: $('#content-overlay').height()+'px'});

                    // Add 'page' to history and show back button
                    $.core.history.add(location.href, {id: parseInt($.core.qs('id')), show_alipay: '1'});
                    $.core.show_back_arrow();
                });
            });
        }
    };
};