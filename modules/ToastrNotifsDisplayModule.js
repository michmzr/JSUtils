/*
 * Copyright (c) 2017. All rights reserved.
 * Author: Michał Mazur <michmzr@gmail.com>
 */

/**
 * Module was create to easier handle toastr notifications
 */
const ToastrNotifsDisplayModule = (function ()
{
    "use strict";

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
        toastr.options.extendedTimeOut = 3000; // How long the toast will display after a user hovers over it

        const alerts = config.alerts;

        const success = alerts.hasOwnProperty('success') ?  alerts.success : null;
        const error = alerts.hasOwnProperty('error') ?  alerts.error : null;
        const warning = alerts.hasOwnProperty('warning') ? alerts.warning : null;
        const info =  alerts.hasOwnProperty('info') ? alerts.info : null;

        //Success
        if (success)
        {
            success.forEach(function (msg)
            {
                plugin.success(msg);
            });
        }

        //Error
        if (error)
        {
            error.forEach(function (msg)
            {
                plugin.error(msg);
            });
        }

        //Warning
        if (warning)
        {
            warning.forEach(function (msg)
            {
                plugin.warning(msg);
            });
        }

        //Info
        if (info)
        {
            info.forEach(function (msg)
            {
                plugin.info(msg);
            });
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