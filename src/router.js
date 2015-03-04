'use strict';
var ResourceManager = require('resource-manager');
var request = require('request');
var Promise = require('promise');
var path = require('path');
var _eval = require('eval');
var EventManager = require('event-manager');
var Handlebars = require('handlebars');
var slugify = require('handlebars-helper-slugify');

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
        this._moduleMaps = {};
        this._history = [];

        // setup helpers
        Handlebars.registerHelper('slugify', slugify);

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
        var config = this._config.pages[url],
            map = {}, page, template;
        if (!this._pageMaps[url]) {
            this._pageMaps[url] = map;
            map.promise = ResourceManager.loadTemplate(config.template).then(function (templateHtml) {
                page = map.page = require(config.script);
                return page.getData(config.data).then(function (data) {
                    return this.loadModules(config.modules).then(function () {
                        template = Handlebars.compile(templateHtml)(data);
                        return page.load({template: template});
                    }.bind(this));
                }.bind(this));
            }.bind(this));
            return map.promise;
        } else {
            this._pageMaps[url].show();
            return Promise.resolve();
        }
    },

    /**
     * Loads modules associated with a route.
     * @param modules
     */
    loadModules: function (modules) {
        var config,
            promises = [];
        modules.forEach(function (moduleKey) {
            config = this._config.modules[moduleKey];
            if (!config) {
                promises.push(true);
            }
            if (!this._moduleMaps[moduleKey]) {
                var map = {};
                map.promise = this._loadModule(moduleKey);
                this._moduleMaps[moduleKey] = map;
                promises.push(map.promise);
            } else {
                this._moduleMaps[moduleKey].show();
                promises.push(true);
            }
        }.bind(this));
        // resolve when all modules have been loaded
        return Promise.all(promises);
    },

    /**
     * Loads an individual module.
     * @param moduleKey
     * @returns {*}
     * @private
     */
    _loadModule: function (moduleKey) {
        var map = {},
            config = this._config.modules[moduleKey],
            module,
            template,
            getDataPromise;
        map.promise = ResourceManager.loadTemplate(config.template).then(function (templateHtml) {
            if (config.script) {
                module = map.module = require(config.script);
                getDataPromise = module.getData(config.data);
            } else {
                getDataPromise = Promise.resolve();
            }
            return getDataPromise.then(function (data) {
                template = Handlebars.compile(templateHtml)(data);
                Handlebars.registerPartial(moduleKey, template);
            });
        }.bind(this));
        return map.promise;
    }

};

module.exports = function (options) {
    return new Router(options);
};