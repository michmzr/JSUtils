(function ($, window, document, undefined) {
    //"use strict";

	let pluginName = 'modalWidget';

    function Plugin(element, options) {
        /**
         * Variables.
         **/
        this.element        = $(element);
        this.options        = $.extend({}, $.fn[pluginName].defaults, options);
        this.modal          =  $('#modal');
        this.modalContent   = this.modal.find('#modalData');

        this.initialized    = false;

        this.init();
    }

    Plugin.prototype = {
        init: function () {
	        let self = this;

            if (self.initialized) return;

            self._initDataArguments();

            if (self.options.whenClick) {
                self.element.on('click', function (event) {
                    event.stopPropagation();
                    self._load.call(self);
                    return false
                })
            } else {
                self._load();
            }

            self.initialized = true;
        },

        _initDataArguments: function () {
	        let self = this;

            self.element.data('boxType', pluginName);
        },

        _load: function () {
	        let self = this,
                modal = this.modal;

            modal.modal({
                keyboard: false,
                backdrop: 'static'
            });

	        modal.on('hide.bs.modal', function () {
                self.options.onClose();

                if (!self.options.whenClick) {
                    self.destroy();
                }
                self.modal.off('hide.bs.modal');

                // zakomentowane bo przeladowuje niepotrzebnie strone po zamknieciu okna modalnego.
                self.modalContent.asyncBox('destroy');
                self.modalContent.empty();
            });

            this.modalContent.asyncBox({
                url      : self.options.url,
                data     : self.options.data,
                method   : self.options.method,
                cache    : self.options.cache,
                onSuccess: function(){
                    self._initHideButton.call(self);

                    ModulesInitController.init();

	                //Modal use for modal widget
	                $(self.modal).find("input[type='submit'],.submit").on('click', function()
	                {
		                $(self.modal).find(".modal-body > form").submit();
	                });
                }
            });
        },

        _initHideButton: function(){
	        let self = this,
                modal = this.modal;

            modal.find('[data-modal-widget-close]').click(function(event){
                event.stopPropagation();
                self.hide.call(self);
                return false;
            })
        },

        hide: function(){
            $('#modal').modal('hide');
        },

        destroy: function () {
	        let self = this;
            if (!self.options.whenClick) {
                self.element.off('click');
            }
            self.element.removeData(pluginName);
        }
    };

    $.fn[pluginName] = function (option, value) {
	    let proccessFunction = function ()
	    {
		    let $this = $(this);
		    let data = $this.data(pluginName);

            if (typeof  data != 'object' && typeof data != 'undefined') {
                if (typeof $this.attr('href') == 'string') {
                    option = {url: $this.attr('href'), whenClick: true};
                } else if (typeof  data == 'string') {
                    option = {url: data, whenClick: true};
                }
                $this.data(pluginName, (data = new Plugin(this, option)));
            } else if (typeof data == 'undefined' && typeof option == 'string') {
                option = {url: option};
                $this.data(pluginName, (data = new Plugin(this, option)));
            } else if (typeof data == 'undefined' && typeof option == 'object') {
                $this.data(pluginName, (data = new Plugin(this, option)));
            } else if (typeof  data == 'object')
            {
                if (typeof option == 'string' && typeof value == 'string' && typeof data[option] == 'function')
                {
                    data[option](value);
                }
            }
        };

        if (option == false || typeof option == 'undefined') {
            return this.find('[data-modal-widget]').each(proccessFunction);
        } else {
            proccessFunction();
            return this
        }
    };


    $.fn[pluginName].defaults = {
        method: 'GET',
        url: undefined,
        cache: false,
        data: undefined,
        whenClick: false,
        onError: function () {
        },
        onNotFound: function () {

        },
        onSuccess: function () {

        },
        onClose: function () {
        }
    };
})(jQuery, window, document);

(function($){
    $(document).modalWidget();
})(jQuery);

let ModalWidget = (function ()
{

    var
        show = function (url, onClose) {
            onClose = onClose || function(){};
            $().modalWidget({url: url, onClose: onClose});
        },
        post = function (url, data) {
            $().modalWidget({url: url, data: data, method: 'POST'});
        },

        hide = function () {
            $('#modal').modal('hide');
        };

    return {
        show: show,
        post: post,
        hide: hide
    }
})();

let AsyncModal = ModalWidget;
