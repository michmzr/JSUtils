/**
 * Created by Michal Mazur on 2016-12-06.
 */

// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 1.1, May 14th, 2011
// by Stefan Gabos

//todo po ukończeniu, przenieść do webpacka, aby automatycznie wkompilowało

(function ($)
{
	$.generatedDataTable = function (element, options)
	{
		let plugin = this;

		plugin.settings = {};
		plugin.columnSettings = {};

		const $element = $(element);

		/**
		 * @param aoData
		 */
		function fnServerParams(aoData)
		{
			/*console.debug(aoData);
			 console.debug(this.plugin.settings.columns);*/

			let pluginSettings = plugin.settings;
			let stgColumns = pluginSettings.columns;

			aoData.columns = aoData.columns.map(function (aoDataColumnEntry)
			{
				try {
					let fieldName = aoDataColumnEntry.name;
					let columnSetting = stgColumns[fieldName];

					aoDataColumnEntry = $.extend({}, aoDataColumnEntry, columnSetting);

					return aoDataColumnEntry;
				} catch (e)
				{
					console.error(e);

					return aoDataColumnEntry;
				}
			});

			/*if (pluginSettings.hasOwnProperty("clazzName"))
			 {
			 //aoData.push( { "name": "clazzName", "value": plugin.settings.clazzName});
			 }*/
		}

		let defaults = {
			clazzName: null,

			isAsync: true,
			asyncUrl: null,
			asyncUrlParams: [],
			columns: [],
			dtOptions: {
				"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
				"sPaginationType": "bootstrap",
				"language": {
					"lengthMenu": "Display _MENU_ records per page",
					"zeroRecords": "Nothing found - sorry",
					"info": "Showing page _PAGE_ of _PAGES_",
					"infoEmpty": "No records available",
					"infoFiltered": "(filtered from _MAX_ total records)"
				},
				"oLanguage": {
					"sLengthMenu": "_MENU_ per page",
					"oPaginate": {
						"sPrevious": "Prev",
						"sNext": "Next"
					}
				},
				'responsive': true,
				'stateSave': true,
				"cache": false,
				"searching": false,
				'ajax': {
					'url': ""
				},
				"fnServerParams": fnServerParams
			}
		};

		plugin.init = function ()
		{
			plugin.settings = $.extend({}, defaults, options);

			if ($($element).prop("tagName").toLowerCase() != "table")
			{
				throw new DOMException("Plugin element must be <table>")
			}

			initDataTable();
		};

		plugin.reloadDataTable = function ()
		{
			$($element).DataTable().ajax.reload(null, false);
		};

		let initDataTable = function ()
		{
			let settings = plugin.settings;

			if (settings.isAsync)
			{
				settings.dtOptions.sServerMethod = "POST";
				settings.dtOptions.bProcessing = true;
				settings.dtOptions.bServerSide = true;

				if (!settings.dtOptions.hasOwnProperty("ajax"))
				{
					settings.dtOptions.ajax = {
						type: 'POST'
					};
				}

				if (settings.hasOwnProperty("asyncUrl"))
				{
					settings.dtOptions.ajax.url = settings.asyncUrl;
				}

				if (!settings.dtOptions.ajax.hasOwnProperty("data"))
				{
					settings.dtOptions.ajax.data = fnServerParams;
				}
			}

			if (settings.hasOwnProperty("columns"))
			{
				let columns = plugin.settings.columns;

				let dtColumns = [];

				let columnsByFieldName = [];

				$.each(columns, function (index, entry)
				{
					/*
					 entry:
					 -name;
					 -title;
					 -langCode; //laravel lang code
					 -editable = true;
					 -filterable = true;
					 -orderable=true
					 -isSelectable = true
					 -columnType = null;
					 */

					let config = {
						"data": entry.name,
						"name": entry.name,
						"orderable": entry.orderable,
						"searchable": false,
						"isSelectable": entry.isSelectable,
						"targets": index
					};

					config.orderable = entry.orderable;

					//Column data type https://datatables.net/reference/option/columns.type
					let type = "string";
					switch (entry.type)
					{
						case 'decimal':
						case 'int':
						case 'float':
							type = "num";

							break;
						case 'html':
							type = "html";

							break;
					}

					config.prototype = type;

					dtColumns.push(config);
					columnsByFieldName[entry.name] = entry;
				});

				settings.dtOptions["columnDefs"] = dtColumns;
				settings.columns = columnsByFieldName;
			}

			plugin.settings = settings;

			console.info("Init datatable ${$element}");

			//DataTable initiation
			try {
				let table = $($element).dataTable(settings.dtOptions);

				//Extra styles
				$('.dataTables_wrapper .dataTables_filter input').addClass("form-control"); // modify table search input
				$('.dataTables_wrapper .dataTables_length select').addClass("form-control"); // modify table per page
				                                                                             // dropdown
			} catch (e)
			{
				console.error(e);
			}
		};

		//Plugin initiation
		plugin.init();
	};

	$.fn.generatedDataTable = function (options)
	{
		return this.each(function ()
		{
			if (undefined == $(this).data('generatedDataTable'))
			{
				let plugin = new $.generatedDataTable(this, options);
				$(this).data('generatedDataTable', plugin);
			}
		});
	}
})(jQuery);