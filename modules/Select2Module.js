/**
 * Created by Michal Mazur on 2016-08-22.
 *
 * @version 1.0
 *
 * @todo docs
 * @todo uprości mechizm inicjacji
 * @todo ładowanie danych powinno być oznaczane ikoną, blokowaniem selecta
 */
var Select2Module = {

	 /**
	  * Default configuration for Select2
	  *
	 * @parametr ajxConfig {url: null, extraParams:  {}}
	 */
	defaults: {
		placeholder: 'Wybierz wartość',
		minimumResultsForSearch: null,
		ajaxConfig: {url: null, extraParams: {}},
		allowClear: true
	},

	init: function (elem, options)
	{
		// console.info("Init Select2Module for element" + jqueryElemToString(elem));
		var initOptions = {};

		$.extend(initOptions, this.defaults, options);

		if (initOptions.escapeMarkup == false)
		{
			initOptions.escapeMarkup = function(m){
				return m;
			}
		}else
		{
			delete initOptions.escapeMarkup;
		}

		//---- Select placeholder ----
		var placeholder = initOptions.placeholder;
		// console.debug("Element placeholder: " + placeholder);

		if ((initOptions.data == undefined) && (initOptions.ajaxConfig && initOptions.ajaxConfig.url  && initOptions.ajaxConfig.url.length > 0))
		{
			// console.info("Init ajax config in Select2Module");
			var ajaxConfig = {
				url: initOptions.ajaxConfig.url,
				dataType: 'json',
				cache: true,
				data: function (args)
				{
					var res = {
						search: args.term || args
					};

					if (initOptions.ajaxConfig && initOptions.ajaxConfig.extraParams)
					{
						$.each(initOptions.ajaxConfig.extraParams, function (index, value)
						{
							res[index] = value;
						});
					}

					return res;
				},
				results: function (data)
				{
					return {results: data};
				}
			};

			if (initOptions.ajax)
				$.extend(initOptions.ajax, initOptions.ajax, ajaxConfig);
			else
				initOptions.ajax = ajaxConfig;

			var initValue = initOptions.hasOwnProperty('value') && initOptions.value ? initOptions.value : $(elem).val();
			
			//Set initValue
			if (initValue)
			{
				//Select2 initialization
				var ajaxDataParams = {value: initValue};

				if (initOptions.ajaxConfig && initOptions.ajaxConfig.extraParams)
				{
					$.each(initOptions.ajaxConfig.extraParams, function (index, value)
					{
						ajaxDataParams[index] = value;
					});
				}

				$.ajax({
					url: initOptions.ajaxConfig.url,
					type: "POST",
					data: ajaxDataParams,
					dataType: 'json'
				}).done(function (data)
				{
					initOptions.data = data.results.length > 0 ? data.results : [];

					if (data.results.length > 0)
					{
						var selIds = [];

						$.each(data.results, function (index, optionData)
						{
							selIds.push(optionData['id']);

							$(elem).append($('<option>', {
								value: optionData['id'],
								text: optionData['text']
							}));
						});

						$(elem).val(selIds);
					}

					$(elem).select2(initOptions).trigger("change");
				}).error(function (jqXHR, textStatus, errorThrown)
					{
						console.log(errorThrown);
						errorThrown.preventDefault();

						return false;
					}
				);
			}else
			{
				//Select2Initialization
				// console.info("Asynchrous select2");
				// console.debug(initOptions);

				$(elem).select2(initOptions);
			}
		} else
		{
			// console.info("Classic select2");
			// console.debug(initOptions);

			$(elem).append($('<option>', {
				value: null,
				text: ""
			}));

			$(elem).select2(initOptions);
		}
	},
	destroy: function ()
	{
		//todo
	}
};