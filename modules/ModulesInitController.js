/**
 * Created by Michal Mazur on 2016-05-11.
 *
 * General module controller for controlling javascript modules and plugins like DatePicker, Select2
 *
 * @type {{init}}
 * @version 1.0
 */
var ModulesInitController = (function () {

    var settings = {
        "triggerElemType": ".modulesInit",
        "dataAttributes": {
            "moduleName": "init-module",
            "config": "init-module-config"
        },
        "modules": {
            "datePicker": DatePickerModule,
            "select2": Select2Module
        }
    };

    var intiModuleInElement = function (elem) {
            console.info("init module for element " + jqueryElemToString(elem));

            var s = settings;
            var elemModuleName = $(elem).data(s.dataAttributes.moduleName);

            if (elemModuleName) {
                var module = s.modules[elemModuleName];

                if (module != undefined) {
                    var initConfigData = $(elem).data(s.dataAttributes.config);

                    //parse module configuration
                    var initConfig = {};

                    if (initConfigData) {
                        if (initConfigData instanceof Object) {
                            initConfig = initConfigData;
                        } else {
                            initConfig = (initConfigData.length > 0) ? $.parseJSON(initConfigData) : {}
                        }
                    }

                    module.init(elem, initConfig);
                } else {
                    console.error("Module " + module + " is uknown or not available");
                }
            } else {
                console.error("Html attribute '" + s.dataAttributes.moduleName + "' is required for element " + jqueryElemToString(elem));
            }
        },

        init = function (el) {
            var s = settings;

	     //   console.info("Init modules for elements with class " + s.triggerElemType);

            if (el)
            {
	            // console.info("Init modules in el");
            	// console.log($(el).find(s.triggerElemType));

                $(el).find(s.triggerElemType).each(function (index, elem) {
                    intiModuleInElement(elem);
                });
            }else
            {
                // console.info("Init modules outside el");

                $(s.triggerElemType).each(function (index, elem) {
                    intiModuleInElement(elem);
                });
            }
        };

    return {
        init: init
    }
})();