'use strict';
var ResourceManager = require('resource-manager');
var request = require('request');
var Promise = require('promise');
var path = require('path');
var _eval = require('eval');
var EventManager = require('event-manager');
var Handlebars = require('handlebars');

/**
 * Router class.
 * @description Represents a manager that handles all routes throughout the app.
 * @class Router
 * @param options
 * @param {String|Object} options.config - Configuration data or url to file that has it
 * @param {Function} options.onUrlChange - When the url changes
 * @return {Router}
 */
var Router = function (options){
    this.initialize(options);
    return this;
};

Router.prototype = /** @lends Router */{

    initialize: function (options) {

        this.options = options || {};

        // allow event listeners
        EventManager.createTarget(this);

        this._pageMaps = {};
        this._history = [];

        this._setupHelpers(options);

    },

    /**
     * Registers helpers for templates that are lazy-loaded.
     * @param {Object} options
     * @private
     */
    _setupHelpers: function (options) {
        options.handlebars = options.handlebars || {};
        var helpers = options.handlebars.helpers,
            key;
        if (helpers) {
            for (key in helpers) {
                if (helpers.hasOwnProperty(key)) {
                    Handlebars.registerHelper(key, helpers[key]);
                }
            }
        }
    },

    /**
     * Starts managing routes.
     */
    start: function () {
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
                request(data).then(function (contents) {
                    contents = _eval(contents);
                    resolve(contents);
                });
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
        var self = this;
        return function (event) {
            return self._onRouteRequest.bind(self);
        }
    },

    /**
     * Resets Route Manager.
     */
    reset: function () {
        this._history = [];
        this._pageMaps = {};
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
     * @returns {Promise} Returns a Promise when the page of the route has loaded
     */
    triggerRoute: function (url, options) {
        if (url !== this._currentPath) {
            history.pushState({path: url}, document.title, url);
            return this._onRouteRequest(url);
        } else {
            return Promise.resolve();
        }
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
     * @return {Promise}
     */
    _onRouteRequest: function (path) {
        // do not navigate if already at the url being requested
        return new Promise(function (resolve) {
            if (path !== this._currentPath) {
                this._currentPath = path;

                this.showPage(path).then(function () {
                    if (!this._loaded) {
                        this._loaded = true;
                        resolve();
                        this.dispatchEvent('page:load');
                    }
                }.bind(this));

                this.dispatchEvent('url:change');
            } else {
                resolve();
            }
        }.bind(this));
    },

    /**
     * Shows a page based on a url.
     * @param {String} url - The url
     * @returns {Promise}
     */
    showPage: function (url) {
        var config = this._config[url],
            map = {}, page;
        if (!this._pageMaps[url]) {
            this._pageMaps[url] = map;
            map.Promise = ResourceManager.loadTemplate(config.template).then(function (content) {
                page = map.page = require(config.script);
                return this._compileTemplate(content, config.data).then(function (result) {
                    return page.load({template: result});
                }.bind(this));
            }.bind(this));
            return map.Promise;
        } else {
            this._pageMaps[url].show();
            return Promise.resolve();
        }
    },

    /**
     * Parses handlebar template using data from a supplied url.
     * @param {String} content - The raw, uncompiled content
     * @param {String} dataUrl - The url where data lives
     * @return {Promise} Returns a Promise that will contain compiled template content
     * @private
     */
    _compileTemplate: function (content, dataUrl) {
        return request(dataUrl).then(function (data) {
            data = JSON.parse(data);
            return Promise.resolve(Handlebars.compile(content)(data));
        });
    }

};

module.exports = function (options) {
    return new Router(options);
};