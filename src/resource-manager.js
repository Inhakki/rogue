'use strict';
/**
 The Resource Manager.
 @class ResourceManager
 @description Represents a manager that loads any CSS and Javascript Resources on the fly.
 */
var ResourceManager = function () {
    this.initialize();
};

ResourceManager.prototype = {

    /**
     * Upon initialization.
     * @memberOf ResourceManager
     */
    initialize: function () {
        this._head = document.getElementsByTagName('head')[0];
        this._cssPaths = {};
        this._scriptPaths = {};
    },

    /**
     * Loads a javascript file.
     * @param {string|Array} paths - The path to the view's js file
     * @param {Function} callback - Function to be called when script is loaded
     * @memberOf ResourceManager
     */
    loadScript: function (paths, callback) {
        var script;
        this._forEachPath(paths, function (path) {
            if (!this._scriptPaths[path]) {
                this._scriptPaths[path] = path;
                script = document.createElement('script');
                script.setAttribute('type','text/javascript');
                script.setAttribute('src', path);
                this._head.appendChild(script);
            }
        }.bind(this), callback);
    },

    /**
     * Removes a script that has the specified path from the head of the document.
     * @param {string|Array} paths - The paths of the scripts to unload
     * @param {Function} [callback] - Callback that fires when done
     * @memberOf ResourceManager
     */
    unloadScript: function (paths, callback) {
        var file;
        this._forEachPath(paths, function (path) {
            file = this._head.querySelectorAll('script[src="' + path + '"]')[0];
            if (file) {
                this._head.removeChild(file);
                this._scriptPaths[path] = null;
            }
        }.bind(this), callback);
    },

    /**
     * Loads css files.
     * @param {Array|String} paths - An array of css paths files to load
     * @param {Function} [callback] - Function to be called when files are loaded
     * @memberOf ResourceManager
     */
    loadCss: function (paths, callback) {
        this._forEachPath(paths, function (path) {
            // TODO: figure out a way to find out when css is guaranteed to be loaded,
            // and make this return a truely asynchronous promise
            if (!this._cssPaths[path]) {
                var el = document.createElement('link');
                el.setAttribute('rel','stylesheet');
                el.setAttribute('href', path);
                this._head.appendChild(el);
                this._cssPaths[path] = el;
            }
        }.bind(this), callback);
    },

    /**
     * Unloads css paths.
     * @param {string|Array} paths - The css paths to unload
     * @param {Function} [callback] - Callback that fires when done
     * @memberOf ResourceManager
     */
    unloadCss: function (paths, callback) {
        var el;
        this._forEachPath(paths, function (path) {
            el = this._cssPaths[path];
            if (el) {
                this._head.removeChild(el);
                this._cssPaths[path] = null;
            }
        }.bind(this), callback);
    },

    /**
     * Takes a string path and makes it an array (if applicable) and calls the provided on every iteration.
     * @param {string|Array} paths - The string or array of paths to loop over
     * @param {Function} func - The function to call on each iteration
     * @param {Function} [callback] - A function that will be fired when all paths are iterated over
     * @memberOf ResourceManager
     * @private
     */
    _forEachPath: function (paths, func, callback) {
        if (typeof paths === 'string') {
            paths = [paths];
        }
        paths.forEach(func);
        callback ? callback() : null;
    },

    /**
     * Removes all cached resources.
     * @memberOf ResourceManager
     */
    flush: function () {
        this.unloadCss(Object.getOwnPropertyNames(this._cssPaths));
        this.unloadScript(Object.getOwnPropertyNames(this._scriptPaths));
    }

};

module.exports = new ResourceManager();