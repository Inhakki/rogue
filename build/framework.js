define(['require'], function (require) {
    'use strict';

    var Framework = function(){
        this.initialize();
    };

    Framework.prototype = {

        /**
         * Initialize framework.
         */
        initialize: function() {

            var requireConfig = this.getRequireConfig();
            if (!requireConfig.paths.framework) {
                console.error('web framework load error: no framework path specified in requirejs paths');
            }
        },

        /**
         * Sets require config value.
         * @param {object} value - The object containing new set of values
         */
        setRequireConfigValue: function (value) {
            if (this.isDojo()) {
                require(value);
            } else {
                require.config(value);
            }
        },

        /**
         * Checks if the the current requirejs was configured by dojo build.
         * @returns {boolean} Returns true if so
         */
        isDojo: function () {
            return typeof dojo !== 'undefined';
        },

        /**
         * Gets the current require config options.
         */
        getRequireConfig: function () {
            if (this.isDojo()) {
                // try dojo's location
                return require.rawConfig;
            } else if (typeof require !== 'undefined') {
                // first try requires 'secret' semi-private location
                // if .s, we can be sure its nested objects will be there
                var s = require.s || requirejs.s;
                return s.contexts._.config;
            } else {
                return null;
            }
        }
    };

    return new Framework();

});