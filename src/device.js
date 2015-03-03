'use strict';

var EventManager = require('event-manager');
/**
 @class Device
 @description A set of utilities for managing the state of the user's current device.
 */
var Device = function () {
    this.initialize();
};

Device.prototype = {

    /**
     * Upon initialization.
     * @memberOf Device
     */
    initialize: function () {
        // allow event listening on the device
        EventManager.createTarget(this);

        this._getOrientationChangeListener = function () {
            var self = this;
            return function () {
                self._onOrientationChange.bind(self);
            }
        };

        window.addEventListener('orientationchange', this._getOrientationChangeListener());
    },

    /**
     * When the user changes the orientation of their device.
     * @private
     */
    _onOrientationChange: function () {
        var orientation;

        if (window.innerHeight <= window.innerWidth) {
            orientation = 'landscape';
        } else {
            orientation = 'portrait';
        }
        this.dispatchEvent('orientationchange', {orientation: orientation});
    },

    /**
     * Gets the user agent string of the current session.
     * @returns {string}
     */
    getUserAgent: function () {
        return window.navigator.userAgent;
    },

    /**
     * Checks if the user is on a specific browser.
     * @param {string|Array} name - The browser OS names to check
     * @returns {boolean}
     */
    isBrowser: function (name) {
        var pattern = name;
        if (Array.isArray(name)) {
            pattern = name.join('|');
        }
        var reg = new RegExp(pattern, 'i');
        return reg.test(this.getUserAgent());
    },

    /**
     * Checks if the user is on a mobile device.
     * @returns {boolean}
     */
    isMobile: function () {
        return this.isBrowser(['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'IEMobile', 'Opera Mini']);
    },

    /**
     * Checks if the OS is of a certain type.
     * @param {string|Array} name - The name of the OS
     * @returns {boolean}
     */
    isOS: function (name) {
        var pattern = name;
        if (Array.isArray(name)) {
            pattern = name.join('|');
        }
        var reg = new RegExp(pattern, 'i');
        return reg.test(this.getUserAgent());
    },

    /**
     * Removes events and cleans up.
     */
    destroy: function () {
        window.removeEventListener('orientationchange', this._getOrientationChangeListener());
        EventManager.destroyTarget(this);
    }

};

module.exports = new Device();