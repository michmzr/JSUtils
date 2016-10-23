/**
 * Created by Michal Mazur on 2016-10-06.
 */
var BlockVisibilityOnValue = (function ()
{
	//todo dostosowanie pod select,checkbox itp.
	//todo potrzebne testy na checkboxach,polach radio itd.

	var self = {};

	var config = {
		"selector": {
			"block": ".block-visibility-on-value"
		},
		"dataAttrs": {
			"showOnValue": "data-block-visibility-show-value"
		}
	};

	//value: $element,
	var elements = {
		"fieldName": null,
		"fieldType": null,
		"fieldsList": {},
		"blocks": {}
	};

	var currentValue = null;

	function showBlock($el)
	{
		$($el).show();
	}

	function hideBlock($el)
	{
		$($el).hide();
	}

	function toggleBlockWithValue(value)
	{
		var blocksToHide = elements.blocks[currentValue];

		if (blocksToHide && blocksToHide.length > 0)
		{
			$(blocksToHide).each(function (index, $el)
			{
				hideBlock($el);
			})
		}

		var blocksToShow = elements.blocks[value];

		if (blocksToShow && blocksToShow.length > 0)
		{
			$(blocksToShow).each(function (index, $el)
			{
				showBlock($el);
			})
		}

		currentValue = value;
	}

	function onFieldOnChange(event)
	{
		var input = event.target;

		var value = $(input).val();

		toggleBlockWithValue(value);
	}

	self.init = function (fieldSelector)
	{
		//Setting radio list
		elements.fieldName = fieldSelector;
		var attrsWithValues = $(fieldSelector);

		var attrTypeName = $(fieldSelector).get(0).nodeName.toLowerCase();
		elements.fieldType = attrTypeName;

		var onChangeEventName = "change";

		switch (attrTypeName)
		{
			case 'select':
				currentValue = $(fieldSelector).val();

				break;
			case 'input':
				var inputType = $(fieldSelector).attr('type');

				switch (inputType)
				{
					//todo rozpoznać, czy jest podpięty plugin
					case 'radio':
					case 'checkbox':
						onChangeEventName = "ifChecked";
						currentValue = $(fieldSelector + ':checked').val();

						break;
					default:
						onChangeEventName = "change";
						currentValue = $(fieldSelector).val();

				}
				//rozróżnienie input.radio, input.text, input.checkbox

				break;
			default:
				onChangeEventName = "change";
				currentValue = $(fieldSelector).val();
		}

		$(attrsWithValues).on(onChangeEventName, function (event)
		{
			onFieldOnChange(event);
		});

		attrsWithValues.each(function (index, $input)
		{
			elements.fieldsList[$($input).val()] = $input;
		});

		elements.fieldsList = attrsWithValues;

		//Setting block visibility depended from current radio button value
		$(document.body).find(config.selector.block).each(function (index, $block)
		{
			var relValue = $($block).attr(config.dataAttrs.showOnValue);

			if (!elements.blocks.hasOwnProperty(relValue))
				elements.blocks[relValue] = [];

			elements.blocks[relValue].push($block);

			if (relValue != currentValue)
				hideBlock($block);
		});

		toggleBlockWithValue(currentValue);

		console.debug(elements);
	};

	return self;
}());