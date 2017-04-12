/**
 * Plugin RemoteAsyncBox
 *
 * Its similiar to AsyncBox, but the content is loading to another block with id
 *  <div data-remote-async-box="#details">
 *      <a href="url">click</a>
 *  </div>
 *
 * @version 1.1
 */
(function ($, window, document, undefined) {

    //"use strict";

	let pluginName = 'remoteAsyncBox';

	let config = {
		'dataAttributes': {
			"initUrl": "remoteAsyncBoxInitUrl" //data-remote-async-box-init-url
		}
	};

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, options);

        this.initialized = false;

        this.init();
    }

    Plugin.prototype = {

        init: function () {
	        let self = this;
            if (self.initialized) return;
            self._initDataArguments();

            self._load();
            self.initialized = true;

	        let initUrl = $(self.element).data(config.dataAttributes.initUrl);
            if (initUrl != undefined)
            {
                this.loadContent(initUrl);
            }
        },

        _initDataArguments: function () {
	        let self = this;

            self.element.data('boxType', pluginName);
        },

        _load: function () {
	        let self = this;

            self._initForms();
            self._initLinks();

            ModulesInitController.init(self.element);
        },

        _formSubmitEvent: function (e) {
	        let self = this;
	        let $form = $(e.currentTarget);

            if (typeof $form.data('submiting') == 'boolean') {
            } else {
                $form.data('submiting', true);

	            let objects = $form.serializeArray();
	            let action = $form.attr('action');
                    $(self.options.target).reloadBox({
                        url: action,
                        data: objects,
                        method: 'POST',
                        onSuccess: function () {
                            $form.removeData('submiting');
                        }
                    })
            }
            return false;
        },

        _initForms: function () {
	        let self = this;
            if (self.options.actionAsync) {
                self.element.find('form').each(function (idx, val) {
                   if (typeof $(val).data('async') == 'undefined') {
                        $(val).submit(function (e) {
                      //      e.stopPropagation();
                            self._formSubmitEvent.call(self, e);
                            return false
                        });
                    }
                })
            }
        },

        _initLinks: function () {
	        let self = this;

            if (self.options.actionAsync) {
                self.element.find('a').each(function (idx, val) {
                    if (typeof $(val).data('async') == 'undefined') {

                        $(val).click(function (e) {
                            e.stopPropagation();
                            return self._linkClickEvent.call(self, e);
                        });
                    }
                })
            }
        },

        _linkClickEvent: function (e) {
	        let self = this;

	        let $link = $(e.currentTarget);
            self.element.html(self.options.loadingPlaceholder);

            self.loadContent($link.attr('href'));

            return false
        },

        loadContent: function(url){
	        let self = this;

            $(self.options.target).reloadBox({
                url: url,
                method: 'GET'
            });
        },

        reload: function (options) {
			//todo
        },

        destroy: function () {
	        let self = this;
            self.element.removeData(pluginName);
        }
    };

    $.fn[pluginName] = function (option, value)
    {
	    let proccessFunction = function ()
        {
	        let $this = $(this);
	        let data = $this.data(pluginName);

            if (typeof data == 'string') {
                option = {target: data};
                $this.data(pluginName, (data = new Plugin(this, option)));
            } else if (typeof data == 'undefined' && typeof option == 'string') {
                option = {target: option};
                $this.data(pluginName, (data = new Plugin(this, option)));
            }

            if (typeof option == 'string' && typeof value == 'string' && typeof data[option] == 'function') {
                data[option](value);
            }
        };

        if (option == false || typeof option == 'undefined') {
            return this.find('[data-remote-async-box]').each(proccessFunction)
        } else
            return this.each(proccessFunction);
    };


    $.fn[pluginName].defaults = {
        target: undefined,
        actionAsync: true
    };

})(jQuery, window, document);

$(document).ready(function () {
    $(document).remoteAsyncBox();
});

