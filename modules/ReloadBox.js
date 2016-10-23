/*
 * @version 1.0
 */
(function ($, window, document, undefined) {

    //"use strict";

    var pluginName = 'reloadBox';

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, options);

        this.initialized = false;

        this.init();
    }

    Plugin.prototype = {

        init: function () {
            var self = this;
           var boxType =  self.element.data('boxType');

            if(typeof boxType == 'string'){
                var box = self.element.data(boxType);
                if(typeof box == 'object'){
                    box.reload(self.options)
                }
            }else{
                self.element.asyncBox(self.options)
            }

            //      var data = self.element.data('asyncBox');

       //     if(typeof data == 'object')
    //            data.reload();
        }
    };

    $.fn[pluginName] = function (option) {
        var proccessFunction = function () {
            new Plugin(this, option);
        };

        return this.each(proccessFunction);
    };

    $.fn[pluginName].defaults = {
        method: 'GET',
        url: undefined,
        cache: false,
        data: undefined,
        onError: function () {
        },
        onNotFound: function () {

        },
        onSuccess: function () {

        }
    };
})(jQuery, window, document);



