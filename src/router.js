'use strict';

var ResourceManager = require('resource-manager');
var request = require('request');
var Promise = require('promise');
var path = require('path');


var _currentRoutePromise;

/**
 * Router class.
 * @description Represents a manager that handles all routes throughout the app.
 * @class Router
 * @param options
 * @param {String|Object} options.config - Configuration data or url to file that has it
 * @param {HTMLElement} options.el - The element to apply loading class to when loading a page
 * @return {Router}
 */
var Router = function (options){
    this.options = options || {};
    return this;
};

Router.prototype = /** @lends Router */{

    /**
     * Starts managing routes.
     */
    start: function () {

        this._pages = {};
        this._history = [];

        this._fetchConfig(this.options.config)
            .then(function (config) {
                this._config = config;
                // handle current url
                this.triggerRoute(window.location.pathname);
                // setup pop state events for future urls
                window.addEventListener('popstate', this._getRouteRequestListener());
            }.bind(this));
    },

    /**
     * Fetches the config.
     * @param data
     * @return {Promise}
     * @private
     */
    _fetchConfig: function (data) {
        if (!data) {
            console.error('RouteManager error: no configuration data was supplied.');
        }
        return new Promise(function (resolve) {
            if (typeof data === 'string') {
                return request(data);
            } else {
                resolve(data);
            }
        });
    },

    /**
     * Gets the onRouteRequestListener
     * @returns {Function}
     * @private
     */
    _getRouteRequestListener: function () {
        return function (event) {
            return this._onRouteRequest.bind(this);
        }
    },

    /**
     * Resets Route Manager.
     */
    reset: function () {
        this._history = [];
        this._pages = {};
    },

    /**
     * Stops routing urls.
     */
    stop: function () {
        window.removeEventListener('popstate', this._getRouteRequestListener());
    },

    /**
     * Navigates to a supplied url.
     * @param {string} url - The url to navigate to.
     * @param {Object} [options] - Set of navigation options
     * @param {boolean} [options.trigger] - True if the route function should be called (defaults to true)
     * @param {boolean} [options.replace] - True to update the URL without creating an entry in the browser's history
     */
    triggerRoute: function (url, options) {
        history.pushState({path: url}, document.title, url);
        _currentRoutePromise = new Promise();
        return _currentRoutePromise;
    },

    /**
     * Navigates to previous url in session history.
     * @param {Number} index - an index with a position relative to the current page (the current page being, of course, index 0)
     */
    goBack: function (index) {
        if (index) {
            window.history.go(index);
        } else {
            window.history.back();
        }
    },

    /**
     * Navigates forward (if gone back).
     * @param {Number} index - an index with a position relative to the current page
     */
    goForward: function (index) {
        if (index) {
            window.history.go(index);
        } else {
            window.history.forward();
        }
    },

    /**
     * Gets the current relative params.
     * @returns {Array} Returns an array of params
     */
    getRelativeUrlParams: function () {
        return this.getRelativeUrl().split('/') || [];
    },

    /**
     * Gets the current relative url.
     * @returns {string} Returns a url string
     */
    getRelativeUrl: function () {
        return this._currentPath || window.location.hash.replace('#', '');
    },

    /**
     * Returns an array containing all urls that were hit previously.
     * @returns {Array} - The array of objects
     */
    getHistory: function () {
        return this._history;
    },

    /**
     * Stores data in the url history.
     * @param {string} args
     * @private
     */
    _storeHistory: function (args) {
        this._history.push({
            path: args[0]
        });
    },

    /**
     * When a route is requested.
     * @param {string} path - The path that is
     * @private
     */
    _onRouteRequest: function (path) {
        // do not navigate if already at the url being requested
        if (path === this._currentPath) {
            return;
        }

        this._loadPage(path)
            .then(function (page) {
                return page.show().then(_currentRoutePromise.resolve);
            }).catch(_currentRoutePromise.reject);
    },

    /**
     * Loads a page's css, template, and script.
     * @param {Object} path - The path of the url associated with the page
     * @private
     */
    _loadPage: function (path) {
        var origPath = this._currentPath,
            config = this.options.config[path],
            cssFilePaths = config.css || [];

        // hide previous view if there is one
        if (origPath && this._pages[origPath]) {
            this._pages[origPath].hide();
        }

        this._currentPath = path;

        return ResourceManager.loadCss(cssFilePaths).then(function () {
            return ResourceManager.loadTemplate(config.template).then(function () {
                this._pages[config.url] = require(config.script);
            }.bind(this));
        }.bind(this));
    }

};

module.exports = function (options) {
    return new Router(options);
};