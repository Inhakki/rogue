define(function () {
    "use strict";

    /**
     * A Caching utility that uses localStorage and sessionStorage.
     * @description Allows storing and removing data that persists beyond a page refresh and isn’t transmitted to the server.
     */
    var CacheManager = function () {};

    CacheManager.prototype = {

        /**
         * Caches data for all eternity.
         * @param {string} key - A unique identifier to keep track of data
         * @param {*} data - Any type of data that needs to be cache
         * @param {Number} [expires] - The number of milliseconds to destroy data (defaults to forever)
         * @param {Function} [callback] - The callback fired when data is successfully stored
         */
        setValue: function (key, data, expires, callback) {
            callback = callback || this._getCallback(arguments);
            this._delegateMethod(localStorage, 'setItem', key, data, callback);
            if (expires) {
                this._setupFlushTime(key, expires);
            }
        },

        /**
         * Gets cached data that was previously stored.
         * @param {string} key - The unique identifier of the data that should be removed
         * @param {Function} [callback] - The callback fired when data is successfully retrieved
         * @returns {*} Returns the data that was cached
         */
        getValue: function (key, callback) {
            return this._delegateMethod(localStorage, 'getItem', key, null, callback);
        },

        /**
         * Removes cached data that was previously stored.
         * @param {string} key - The unique identifier of the data that should be removed
         * @param {Function} [callback] - The callback fired when data is successfully removed
         */
        flushValue: function (key, callback) {
            this._delegateMethod(localStorage, 'removeItem', key, null, callback);
        },

        /**
         * Caches data until the user closes their browser session (refreshing the browser will not destroy data).
         * @param {string} key - A unique identifier to keep track of data
         * @param {*} data - Any type of data that needs to be cache
         * @param {Function} [callback] - The callback fired when data is successfully stored
         */
        setSessionValue: function (key, data, callback) {
            this._delegateMethod(sessionStorage, 'setItem', key, data, callback);
        },

        /**
         * Gets a previously stored session value.
         * @param {string} key - The unique identifier of the data that should be removed
         * @param {Function} [callback] - The callback fired when data is successfully retrieved
         * @returns {*} Returns the data that was cached
         */
        getSessionValue: function (key, callback) {
            return this._delegateMethod(sessionStorage, 'getItem', key, null, callback);
        },

        /**
         * Removes cached data that was previously stored.
         * @param {string} key - The unique identifier of the data that should be removed
         * @param {Function} [callback] - The callback fired when data is successfully removed
         */
        flushSessionValue: function (key, callback) {
            this._delegateMethod(sessionStorage, 'removeItem', key, null, callback);
        },

        /**
         * Sets up a timer of when to destroy data.
         * @param {string} key - The key of the data to destroy when timer runs out
         * @param {Number} expires - The amount of milliseconds until the data is destroyed
         * @private
         */
        _setupFlushTime: function (key, expires) {
            this.timers = this.timers || {};
            this.timers[key] = setTimeout(function () {
                this.flushValue.call(this, key, function () {
                    clearTimeout(this.timers[key]);
                }.bind(this));
            }.bind(this), expires);
        },

        /**
         * Detects whether a set of arguments contains a function, if so, it returns it.
         * @param {arguments} args - The arguments to the function
         * @returns {Function|null} Returns the function if found, null if not
         * @private
         */
        _getCallback: function (args) {
            if (typeof arguments[arguments.length - 1] === 'function') {
                return arguments[arguments.length - 1];
            } else {
                return null;
            }
        },

        /**
         * A private delegator that handles a lot of repetitive operations with storage methods.
         * @param {Object} obj - The Storage object
         * @param {string} method - The method name to call
         * @param {string} key - The key for the data
         * @param {*} [data] - The data
         * @param {Function} [callback] - Function to call when operation completes
         * @private
         */
        _delegateMethod: function (obj, method, key, data, callback) {

            if (method === 'getItem' || method === 'getItem') {
                data = obj[method](key);
            } else if (!data) {
                obj[method](key);
            } else {
                obj[method](key, data);
            }

            if (callback) {
                callback(data);
            }
            return data;
        },

        /**
         * Constructs an error message.
         * @param {string} message - The message string
         * @returns {string} - The final message
         * @private
         */
        _constructErrorMessage: function (message) {
            return 'CacheManager error: ' + message;
        },

        /**
         * Caches data for all eternity.
         * @param {string} key - A unique identifier to keep track of data
         * @param {*} data - Any type of data that needs to be cache
         * @deprecated since 1.3.0
         */
        cacheData: function (key, data) {
            this.setValue(key, data);
        },

        /**
         * Gets cached data that was previously stored.
         * @param {string} key - The unique identifier of the data that should be removed
         * @returns {*} Returns the data that was cached
         * @deprecated since 1.3.0
         */
        getCacheData: function (key) {
            return this.getValue(key);
        },

        /**
         * Removes cached data that was previously stored.
         * @param {string} key - The unique identifier of the data that should be removed
         * @deprecated since 1.3.0
         */
        flushData: function (key) {
            this.flushValue(key);
        }

    };

    return new CacheManager();

});