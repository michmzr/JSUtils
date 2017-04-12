/*
 * Copyright (c) 2017. All rights reserved.
 * Author: Michał Mazur <michmzr@gmail.com>
 */

(function ($, XHR)
{
	let onAjaxComplete = function (event, xhr)
	{
		const ASYNC_CMD_NAME = "asyncControl";

		try {
			let retData = $.parseJSON(xhr.responseText);

			if (retData instanceof Object)
			{
				if (retData.hasOwnProperty(ASYNC_CMD_NAME))
				{
					let opersData = retData;

					// console.debug("Answered " + ASYNC_CMD_NAME + " from " + xhr._url);

					$.each(opersData.asyncControl, function (key, keyData)
					{
						// console.debug(key + " => " + keyData);

						switch (key)
						{
							//redirect to url
							case "location-redirect":
								window.location = keyData;
								break;
							//reload current url
							case "location-reload":
								window.location.reload();

								break;
							//close modal widget
							case "modal-close":
								ModalWidget.hide();

								break;
							//Reload JSGrid table
							case "jsgrid-reload":
								$(keyData).jsGrid("loadData");

								break;
							//Close modal widget with success event
							case "modal-close-with-success":
								ModalWidget.hide();
								$(document).trigger('modal-close-with-success');

								break;
							//Reload AsyncBox
							case "async-box-reload":
								AsyncBox.reload(keyData);

								break;
							//Reload ReloadBox
							case "reload-box":
								//console.log( $(keyData) )

								let el = $(keyData);

								if (!el.is(':visible'))
								{
									el.closest('[data-ts-init="inputBody"]').find('.input-body').slideDown(400, function ()
									{
										$('html, body').animate({
											scrollTop: $(keyData).offset().top + $(keyData).height()
										}, 500, function ()
										{
											$(keyData).reloadBox();
										});
									});
								} else {
									$('html, body').animate({
										scrollTop: $(keyData).offset().top + $(keyData).height()
									}, 500, function ()
									{
										$(keyData).reloadBox();
									});
								}

								break;
						}
					});

					//Alerts
					if (opersData.hasOwnProperty("alerts") && opersData.alerts.length > 0)
					{
						//todo handling alerts
						console.debug(opersData.alerts);
					}

					//Notifications
					if (opersData.hasOwnProperty("toastr") && opersData.toastr.length > 0)
					{
						let toastrNotifs = opersData.toastr;

						let notifs = {};

						for (let ind in toastrNotifs)
						{
							let type = toastrNotifs[ind].type;
							let msg = toastrNotifs[ind].msg;

							if (!notifs.hasOwnProperty(type))
								notifs[type] = [];

							notifs[type].push(msg);
						}

						ToastrNotifsDisplayModule.init({alerts: notifs});
					}
				}
			}
		} catch (e)
		{
			console.error(e);
		}
	};

	let open = XHR.prototype.open;
	let send = XHR.prototype.send;

	XHR.prototype.open = function (method, url, async, user, pass)
	{
		this._url = url;
		open.call(this, method, url, async, user, pass);
	};

	XHR.prototype.send = function (data)
	{
		let self = this;
		let start;
		let oldOnReadyStateChange;
		let url = this._url;

		function onReadyStateChange(event)
		{
			if (self.readyState === 4 /* complete */)
			{
				onAjaxComplete(event, this);
			}

			if (oldOnReadyStateChange) {
				oldOnReadyStateChange();
			}
		}

		if (!this.noIntercept) {
			if (this.addEventListener) {
				this.addEventListener("readystatechange", onReadyStateChange, false);
			} else {
				oldOnReadyStateChange = this.onreadystatechange;
				this.onreadystatechange = onReadyStateChange;
			}
		}

		send.call(this, data);
	}
})(jQuery, XMLHttpRequest);

