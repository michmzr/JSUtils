/**
 * Created by Michal Mazur on 2016-05-11.
 *
 * General module controller for controlling javascript modules and plugins like DatePicker, Select2
 *
 * @type {{init}}
 * @version 1.1
 */
let ModulesInitController = (function ()
{

	let settings = {
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

	let initModuleInElement = function (elem)
		{
			console.info("init module for element " + jqueryElemToString(elem));

			let s = settings;
			let elemModuleName = $(elem).data(s.dataAttributes.moduleName);

			if (elemModuleName)
			{
				let module = s.modules[elemModuleName];

				let initConfigData = $(elem).data(s.dataAttributes.config);

				//parse module configuration
				let initConfig = {};

				if (initConfigData)
				{
					if (initConfigData instanceof Object)
					{
						initConfig = initConfigData;
					} else
					{
						initConfig = (initConfigData.length > 0) ? $.parseJSON(initConfigData) : {}
					}
				}

				if (module != undefined)
				{
					module.init(elem, initConfig);
				} else
				{
					initPlugin(elem, elemModuleName , initConfig)
				}
			} else
			{
				console.error("Html attribute '" + s.dataAttributes.moduleName + "' is required for element " + jqueryElemToString(elem));
			}
		},

		initPlugin = function ($el, pluginName, options)
		{
			console.log("Plugin name " + pluginName + " with config " + options);

			$($el)[pluginName](options);
		},

		init = function (el)
		{
			let s = settings;

			//   console.info("Init modules for elements with class " + s.triggerElemType);

			if (el)
			{
				// console.info("Init modules in el");
				// console.log($(el).find(s.triggerElemType));

				$(el).find(s.triggerElemType).each(function (index, elem)
				{
					initModuleInElement(elem);
				});
			} else
			{
				// console.info("Init modules outside el");

				$(s.triggerElemType).each(function (index, elem)
				{
					initModuleInElement(elem);
				});
			}
		};

	return {
		init: init
	}
})();