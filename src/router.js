'use strict';

var ResourceManager = require('resource-manager');
var Request = require('request');
var Promise = require('promise');

/**
 * Router class.
 * @description Represents a manager that handles all routes throughout the app.
 * @constructor
 */
var Router = function (){
    this.start();
};
Router.prototype = /** @lends Router */{

    /**
     * Starts managing routes based on a supplied config.
     * @param {Object} options - The options
     * @param {String|Object} options.config - Configuration data or url to file that has it
     * @param {HTMLElement} options.el - The element to apply loading class to when loading a page
     */
    start: function (options) {

        this.options = options || {};
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
     */
    _fetchConfig: function (data) {
        if (!data) {
            console.error('RouteManager error: no configuration data was supplied.');
        }
        return new Promise(function (resolve) {
            if (typeof data === 'string') {
                return Request(data);
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

        this.options.el.classList.add('page-loading');
        this._loadPage(path).then(function (page) {
            page.show().then(function () {
                this.options.el.classList.remove('page-loading');
            }.bind(this));
        }.bind(this));

    },

    /**
     * Loads a page's css, template, and script.
     * @param {Object} path - The path of the url associated with the page
     * @private
     */
    _loadPage: function (path) {
        var origPath = this._currentPath,
            config = this._config(path),
            cssFilePaths = config.css || [];

        // hide previous view if there is one
        if (origPath && this._pages[origPath]) {
            this._pages[origPath].hide();
        }

        this._currentPath = path;

        return ResourceManager.loadCss(cssFilePaths).then(function () {
            return ResourceManager.loadTemplate(config.template).then(function () {
                return ResourceManager.loadScript(config.script).then(function (page) {
                    this._pages[config.url] = page;
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }

};

module.exports = new Router();