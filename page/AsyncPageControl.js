/**
 * Created by Michal.Mazur on 2016-02-19.
 *
 * Module listen for succesfull ajax connection and look for a page control commands from asynchrous controller. it help to close modal windows,
 * reload asycnhrous blocks etc
 *
 * @version 1.0
 */
(function($){
    var onAjaxSuccess = function (event, xhr, settings)
    {
        const ASYNC_CMD_NAME = "asyncControl";

        try {
            var retData = $.parseJSON(xhr.responseText); //odpowiedź kontrollera może być w postaci JSON

            if (retData instanceof Object) {
                if (retData.hasOwnProperty(ASYNC_CMD_NAME)) {
                    var opersData = retData[ASYNC_CMD_NAME];

                    console.debug("Answered " + ASYNC_CMD_NAME + " from " + settings.url);

                    $.each(opersData, function (key, keyData) {
                        // console.debug(key + " => " + keyData);

                        switch (key) {
                            case "location-redirect":
                                window.location = keyData;
                                break;

                            case "location-reload":
                                window.location.reload();

                                break;
                            case "modal-close":
                                ModalWidget.hide();

                                break;
                            case "modal-close-with-success":
                                ModalWidget.hide();
                                $(document).trigger('modal-close-with-success');

                                break;
                            case "async-box-reload":
                                AsyncBox.reload(keyData);

                                break;
                            case "reload-box":
                                //console.log( $(keyData) )

                                var el = $(keyData);

                                if(!el.is(':visible')){
                                    el
                                        .closest('[data-ts-init="inputBody"]')
                                        .find('.input-body')
                                        .slideDown(400, function(){
                                            $('html, body').animate({
                                                scrollTop: $(keyData).offset().top + $(keyData).height()
                                            }, 500, function(){
                                                $(keyData).reloadBox();
                                            });
                                        });
                                } else {
                                    $('html, body').animate({
                                        scrollTop: $(keyData).offset().top + $(keyData).height()
                                    }, 500, function(){
                                        $(keyData).reloadBox();
                                    });
                                }

                                break;
                            case "alerts-display-html":
                                var joined = keyData.join("\n");
                                $(joined).appendTo(document.body);
                                break;
                        }
                    });
                }
            }
        } catch (e) {
        }
    };

    $(window).ajaxSuccess(onAjaxSuccess);
})(jQuery);

