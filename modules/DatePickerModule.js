/**
 * Created by Michal Mazur <michmzr@gmail.com> on 2016-05-11.
 *
 * Plugin is used for initialition Datepicker in input
 */
var DatePickerModule = {
    /**
     * DatePickerModule conifguration for DatePicker
     */
    defaults: {
        dateFormat : "yy-mm-dd" //2016-05-07
    },

    init: function(elem, options) {
        console.info("Init DatePicker for element" + jqueryElemToString(elem));

        var initOptions = {};

        $.extend(initOptions, this.defaults, options);

        var startDate = $(elem).val();
        if(startDate)
        {
            initOptions.startDate = startDate;
        }

        $(elem).datepicker(initOptions);
    },

    destroy: function(){
        //todo
    }
};