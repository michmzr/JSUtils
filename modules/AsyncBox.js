
/**
 * JS library loads the designated Box contents asynchronously.
  * In addition capture all click the links and submit form
  * Also loaded asynchronously to the box which was launched this library.
  **
 *
 * To init plugin you can use:
 * case a) use attributeata-async-box="http://...."
 * case b) use attribute data-async-box-no-load="http://...."
 * case b) $('#targetBox').asyncBox('http://....').
 *
 *
 * If you can load a new data to the b.ock you need to user plugin ReloadBox np. $('#targetBox').reloadBox({url:
 * 'http:///'});
 **
 * Copyrights by Michal Mazur <michmzr@gmail.com>
 *
 * @version 1.0
 */

(function ($, window, document, undefined) {

    "use strict";

	let pluginName = 'asyncBox';

	let EVENT_AJAX_SUCCESS = "ajax-success";
	let EVENT_AJAX_ERROR = "ajax-error";
	let EVENT_AJAX_FINISHED = "ajax-finished";

    function Plugin(element, options) {

        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, options);

        if (typeof this.options.target === 'undefined')
            this.target = $(element);
        else
            this.target = $(this.options.target);

        this.initialized = false;

        this.init();
    }

    Plugin.prototype = {

        init: function () {
	        let self = this;
            if (self.initialized) return;
            self._initDataArguments();

            if (this.element.data("asyncBoxNoLoad"))
                self.options.init = false;

            if (self.options.init)
                self._load();
            else
                self._initContentPlugins();

            self.initialized = true;
        },
        _triggerCustomEvent: function(event, eventData)
        {
            //triggers from element a custom event with map

            $(this.element).trigger(event, eventData);
        },
        _triggerAjaxEvent: function (event, url, data, msg) {
	        let eventData = {};

            eventData.url = url;
            eventData.msg = msg;
            eventData.data = data;

            this._triggerCustomEvent(event, eventData);
        },
        _onAjaxSuccess: function (url, data, msg) {
            //trigger custom event when last ajax communication ends with success

            this.options.onSuccess();

            this._triggerAjaxEvent(EVENT_AJAX_SUCCESS, url, data, msg);
        },
        _onAjaxError: function (url, data, msg) {
            //trigger custom event when last ajax communication ends with error
            console.error("Ajax error url " + url + " msg="+msg);

            this.options.onError();

            this._triggerAjaxEvent(EVENT_AJAX_ERROR, url, data, msg);
        },
        _onAjaxFinished: function (url, data, msg) {
            this._triggerAjaxEvent(EVENT_AJAX_FINISHED, url, msg, data);
        },
        _initDataArguments: function () {
	        let self = this;

            self.element.data('boxType', pluginName);
        },
        _initContentPlugins: function () {
	        let self = this;

            self._initForms(self.element);
            self._initLinks(self.element);

            self.element.asyncBox(false);
            // self.element.detailsTable(false);
            // self.element.tabBox(false);
            self.element.modalWidget(false);
            // self.element.asyncAction(false);
            //  self.element.remoteAsyncBox(false);
        },
        _ajax: function (method, url, cache, data, onSuccess) {
	        let self = this;

            self.element.html(self.options.loadingPlaceholder);

            $.ajax({
                type: method,
                url: url,
                cache: cache,
                data: data,

                beforeSend: function (xhr, setting) {
	                let url = setting.url;
                    url = url.replace("&_=", "&requestKey=");
                    setting.url = url;
                }
            }).done(function (data, textStatus, jqXHR) {
                self.element.html("");

                try {
                    $.parseJSON(data); //odpowiedź kontrolelra może być w postaci JSON
                    console.debug("Its impossible to load content into element, becouse async controller returned JSON");
                } catch (e) {
                    if (!(data instanceof Object)){
                        if(typeof self.element.data('replace') != 'undefined')
                            self.element.replaceWith(data);
                        else
                            $(data).appendTo(self.element);
                    }
                }

                if (typeof onSuccess == 'function')
                    onSuccess();

                self._initContentPlugins();

                self._onAjaxSuccess(url, {}, "");

                if ($.fn.mask) {
                    self.element.find('[data-mask]').each(function () {

	                    let $this = $(this),
                            mask = $this.attr('data-mask') || 'error...', mask_placeholder = $this.attr('data-mask-placeholder') || 'X';

                        $this.mask(mask, {
                            placeholder: mask_placeholder
                        });

                        //clear memory reference
                        $this = null;
                    });
                }

                ModulesInitController.init(self.element);
            }).fail(function (jqXHR, textStatus) {
                self.element.html(self.options.errorMessage);

                self._onAjaxError(url, jqXHR, textStatus)
            }).always(function () {
                self._onAjaxFinished(url, {}, "Completed ajax connection");
            });
        },

        _load: function () {
	        let self = this;

            self._ajax(self.options.method, self.options.url, self.options.cache, self.options.data);

        },
        _formSubmitEvent: function (e) {
	        let self = this;

	        let $form = $(e.currentTarget);

            if ($form.data('submiting')) {
            } else {
                $form.data('submiting', true);

	            let objects = $form.serializeArray();
	            let action = $form.attr('action');
                self.options.url = action;

                self._ajax('POST', action, self.options.cache, objects, function () {
                    $form.data('submiting', undefined);
                });
            }

            return false;
        },

        _initForms: function () {
	        let self = this;

            if (self.options.actionAsync) {
                self.element.find('form').each(function (idx, val) {

                    if (typeof $(val).data('async') == 'undefined') {
                        if (typeof  $(val).data('formValidation') == 'undefined') {
                            $(val).submit(function (e) {
                                e.stopPropagation();
                                self._formSubmitEvent.call(self, e);
                                return false
                            });
                        } else {
                            $(val).on('success.form.fv', function (e) {
                                e.stopPropagation();
                                self._formSubmitEvent.call(self, e);
                                return false
                            })
                        }
                    }
                })
            }
        },

        _initLinks: function () {
	        let self = this;

            if (self.options.actionAsync) {
                self.element.find('a').each(function (idx, val) {
                    if ($(val).parent("[data-remote-async-box]").length == 0 && typeof $(val).data('async') == 'undefined') {
                        $(val).click(function (e) {
                            e.stopPropagation();
                            self._linkClickEvent.call(self, e);
                            return false
                        });
                    }
                })
            }
        },

        _linkClickEvent: function (e) {
	        let self = this;

	        let $link = $(e.currentTarget);
            self.element.html(self.options.loadingPlaceholder);
            self.options.url = $link.attr('href');

            self._ajax('GET', $link.attr('href'), self.options.cache);
            return false
        },

        reload: function (options) {
	        let self = this;

            if (typeof  options == 'undefined') {
                self._load();
            } else if (typeof  options == 'string') {
                self.options.url = options;
                self.options.url = options;
                self._load();

            } else if (typeof  options == 'object') {
                self.options = $.extend({}, self.options, options);

                self._load();
            }
        },

        destroy: function () {
	        let self = this;
            self.element.removeData(pluginName);
            self.element.empty();
        }
    };

    $.fn[pluginName] = function (option, value)
    {
	    let proccessFunction = function ()
	    {
		    let $this = $(this);
		    let data = $this.data(pluginName);

            if (typeof data == 'string') {
                option = {url: data};
                $this.data(pluginName, (data = new Plugin(this, option)));
            } else if (typeof data == 'undefined') {
                if (typeof option == 'string') {
                    option = {url: option};
                    $this.data(pluginName, (data = new Plugin(this, option)));
                } else if (typeof option == 'object') {
                    $this.data(pluginName, (data = new Plugin(this, option)));
                }
            } else if (typeof data == "object") {

                if(typeof option == 'string' && option != 'destroy' )
                $this.data(pluginName, (data = new Plugin(this, data.options)));
            }

            if (typeof option == 'string') {
                data[option](value);
            }
        };

        if (option == false || typeof option == 'undefined')
            return this.find('[data-async-box]').each(proccessFunction);
          else
            return this.each(proccessFunction);
    };

    /**
     * Plugin default configurations for AsyncBox
     *
     * @param {string] defaults.method
     * @param {string] defaults.url url to content
     * @param {string] defaults.cache Default is false
     * @param {string] defaults.data
     * @param {boolean] defaults.init Default is true. Setting can be load from element attribut
     *     [data-async-box-no-load]. True - load asynchrous content from (@attr url) on init
     * @param {string] defaults.actionAsync Default is true.
     * @param {string] defaults.errorMessage 'Error'
     * @param {string] defaults.loadingPlaceholder
     * @param {Function] defaults.onError function triggered after ajax error
     * @param {Function] defaults.onNotFound function triggered after http error
     * @param {Function] defaults.onSuccess function triggered after succesfull ajax connection
     */
    $.fn[pluginName].defaults = {
        method: 'GET',
        url: undefined,
        cache: false,
        data: undefined,
        init: true, //If element have attribut [data-async-box-no-load] then init = false
        actionAsync: true,
        errorMessage: 'Error',
        loadingPlaceholder: '<p class="lead text-center" style="padding: 20px;"><i class="fa fa-gear fa-spin"></i> Loading ... </p>',
        onError: function () {},
        onNotFound: function () {},
        onSuccess: function () {}
    };
})(jQuery, window, document);

$(document).ready(function () {
    $(document).asyncBox();
});

/**
 * Dla zachowana zgodności z resztą starego kodu
 * @deprecated
 */
let AsyncBox = (function ()
{

    var
        load = function (box, url) {
            $(box).asyncBox(url)
        };

    return {
        load: load
    }

})();
