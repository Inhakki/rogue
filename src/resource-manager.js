var Promise = require('promise');
var request = require('request');

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
     * @memberOf ResourceManager
     * @return {Promise}
     */
    loadScript: function (paths) {
        var script;
        if (!this._loadScriptPromise) {
            this._loadScriptPromise = new Promise(function (resolve) {
                paths = this._ensurePathArray(paths);
                paths.forEach(function (path) {
                    if (!this._scriptPaths[path]) {
                        this._scriptPaths[path] = path;
                        script = this.createScriptElement();
                        script.setAttribute('type','text/javascript');
                        script.src = path;
                        script.addEventListener('load', resolve);
                        this._head.appendChild(script);
                    }
                }.bind(this));
            }.bind(this));
        } else {
            this._loadScriptPromise = Promise.resolve();
        }
        return this._loadScriptPromise;
    },

    /**
     * Removes a script that has the specified path from the head of the document.
     * @param {string|Array} paths - The paths of the scripts to unload
     * @memberOf ResourceManager
     */
    unloadScript: function (paths) {
        var file;
        return new Promise(function (resolve) {
            paths = this._ensurePathArray(paths);
            paths.forEach(function (path) {
                file = this._head.querySelectorAll('script[src="' + path + '"]')[0];
                if (file) {
                    this._head.removeChild(file);
                    this._scriptPaths[path] = null;
                }
            }.bind(this));
            resolve();
        }.bind(this));
    },

    /**
     * Creates a new script element.
     * @returns {HTMLElement}
     */
    createScriptElement: function () {
        return document.createElement('script');
    },

    /**
     * Loads css files.
     * @param {Array|String} paths - An array of css paths files to load
     * @memberOf ResourceManager
     * @return {Promise}
     */
    loadCss: function (paths) {
        return new Promise(function (resolve) {
            paths = this._ensurePathArray(paths);
            paths.forEach(function (path) {
                // TODO: figure out a way to find out when css is guaranteed to be loaded,
                // and make this return a truely asynchronous promise
                if (!this._cssPaths[path]) {
                    var el = document.createElement('link');
                    el.setAttribute('rel','stylesheet');
                    el.setAttribute('href', path);
                    this._head.appendChild(el);
                    this._cssPaths[path] = el;
                }
            }.bind(this));
            resolve();
        }.bind(this));
    },

    /**
     * Unloads css paths.
     * @param {string|Array} paths - The css paths to unload
     * @memberOf ResourceManager
     * @return {Promise}
     */
    unloadCss: function (paths) {
        var el;
        return new Promise(function (resolve) {
            paths = this._ensurePathArray(paths);
            paths.forEach(function (path) {
                el = this._cssPaths[path];
                if (el) {
                    this._head.removeChild(el);
                    this._cssPaths[path] = null;
                }
            }.bind(this));
            resolve();
        }.bind(this));
    },

    /**
     * Parses a template into a DOM element, then returns element back to you.
     * @param {string} path - The path to the template
     * @param {HTMLElement} [el] - The element to attach template to
     * @returns {Promise} Returns a promise that resolves with contents of template file
     */
    loadTemplate: function (path, el) {
        return new Promise(function (resolve) {
            return request(path).then(function (contents) {
                if (el) {
                    el.innerHTML = contents;
                    contents = el;
                }
                resolve(contents);
            });
        });
    },

    /**
     * Makes sure that a path is converted to an array.
     * @param paths
     * @returns {*}
     * @private
     */
    _ensurePathArray: function (paths) {
        if (typeof paths === 'string') {
            paths = [paths];
        }
        return paths;
    },

    /**
     * Removes all cached resources.
     * @memberOf ResourceManager
     */
    flush: function () {
        this.unloadCss(Object.getOwnPropertyNames(this._cssPaths));
        this._cssPaths = {};
        this.unloadScript(Object.getOwnPropertyNames(this._scriptPaths));
        this._scriptPaths = {};
        this._loadScriptPromise = null;
    }

};

module.exports = new ResourceManager();