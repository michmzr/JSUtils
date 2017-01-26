/*
 * Copyright (c) 2016. All rights reserved.
 *  Licensed under MIT (https://github.com/tabalinas/jsgrid/blob/master/LICENSE)
 *
 * @author: Michal Mazur <michmzr@gmail.com>
 */

/**
 * Module was create to easier handle toastr notifications
 */
const ToastrNotifsDisplayModule = (function ()
{
    let plugin = {}, config = {};

    /**
     * config:
     *      alerts: ['success' => ["success. Object updated", "Yeah...", ....], 'error' => [...], 'warning' => [...],
     * 'info' => [...]]
     * @param config
     */
    plugin.init = function (config)
    {
        toastr.options.escapeHtml = true;
        toastr.options.timeOut = 0; // How long the toast will display without user interaction
        toastr.options.extendedTimeOut = 0; // How long the toast will display after a user hovers over it

        // console.debug(config);

        let alerts = config.alerts;

        //Success
        for (let msg of alerts.success)
        {
            // console.debug("success: " +msg);

            plugin.success(msg);
        }

        //Error
        for (let msg of alerts.error)
        {
            plugin.error(msg);
        }

        //Warning
        for (let msg of alerts.warning)
        {
            plugin.warning(msg);
        }

        //Info
        for (let msg of alerts.info)
        {
            plugin.info(msg);
        }
    };

    plugin.success = function(msg){
        toastr.success(msg);
    };

    plugin.error = function(msg)
    {
        toastr.error(msg);
    };

    plugin.warning = function(msg)
    {
        toastr.warning(msg);
    };

    plugin.info = function (msg)
    {
        toastr.info(msg);
    };

    return plugin;
}());