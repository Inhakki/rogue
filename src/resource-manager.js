define([
    'jquery',
    'underscore'
], function (
    $,
    _
) {
    'use strict';

    /**
     The Resource Manager.
     @description Represents a manager that handles all resource and media management throughout the app.
     */
    var ResourceManager = function () {
        this.initialize();
    };

    ResourceManager.prototype = {

        /**
         * Upon initialization.
         */
        initialize: function () {
            this._head = document.getElementsByTagName('head')[0];
            this._cssPaths = {};
            this._scriptPaths = {};
        },

        /**
         * Loads a javascript file.
         * @param {string} path - The path to the view's js file
         * @param {Function} onComplete - Function to be called when script is loaded
         */
        loadScript: function (path, onComplete) {
            if (!this._scriptPaths[path]) {
                this._scriptPaths[path] = path;
                var script = document.createElement('script');
                script.setAttribute('type','text/javascript');
                script.setAttribute('src', path);
                this._head.appendChild(script);
                onComplete ? onComplete() : null;
            } else {
                onComplete ? onComplete() : null;
            }
        },

        /**
         * Loads css files.
         * @param {Array|String} cssFiles - An array of css paths files to load
         * @param {Function} onComplete - Function to be called when files are loaded
         */
        loadCss: function (cssFiles, onComplete) {
            var i,
                path,
                count = cssFiles.length;
            if (typeof cssFiles === 'string') {
                this._loadCssFile(cssFiles);
            } else {
                for (i = 0; i < count; i++) {
                    path = cssFiles[i];
                    this._loadCssFile(path);
                }
            }
            onComplete ? onComplete() : null;
        },


        /**
         * Loads a single css file.
         * @param {String} path - The path to the css file to load
         * @private
         */
        _loadCssFile: function (path) {
            // TODO: figure out a way to find out when css is guaranteed to be loaded,
            // and make this return a truely asynchronous promise
            if (!this._cssPaths[path]) {
                var el = document.createElement('link');
                el.setAttribute('rel','stylesheet');
                el.setAttribute('href', path);
                this._head.appendChild(el);
                this._cssPaths[path] = path;
            }
        },

        /**
         * Removes all cached resources.
         */
        flush: function () {
            this._head = null;
            this._cssPaths = [];
            this._scriptPaths = {};
        }

    };

    return new ResourceManager();

});
