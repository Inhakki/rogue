define(function () {
    "use strict";

    /**
     * Creates a new CacheManager instance.
     * @description Allows storing and removing persistent data.
     */
    var CacheManager = function () {
        this.initialize();
    };

    CacheManager.prototype = {

        /**
         * Initializes the manager.
         */
        initialize: function () {
            this._errors = {
                notStarted: 'cannot use manager, start() has not yet been called'
            }
        },

        /**
         * Starts managing caching.
         */
        start: function () {
            this._cachedData = this._cachedData || {};
            this._started = true;
        },

        /**
         * Stops caching.
         */
        stop: function () {
            this._started = false;
        },

        /**
         * Caches data for all eternity (or until CacheManager is destroyed).
         * @param {string} key - A unique identifier to keep track of data
         * @param {*} data - Any type of data that needs to be cache
         * @param {string} [password] - A secret key that will be required to override or remove the data from cache
         */
        cacheData: function (key, data, password) {
            var existingData;

            if (!this._started) {
                throw this._constructErrorMessage(this._errors.notStarted);
            }

            existingData = this._cachedData[key];
            if (!existingData || existingData.password === password) {
                this._cachedData[key] = {data: data, password: password};
            }
        },

        /**
         * Gets cached data that was previously stored.
         * @param {string} key - The unique identifier of the data that should be removed
         * @param {string} [password] - The secret key needed access the data
         * @returns {*} Returns the data that was cached
         */
        getCacheData: function (key, password) {
            var existingData,
                data;

            if (!this._started) {
                throw this._constructErrorMessage(this._errors.notStarted);
            } else {
                existingData = this._cachedData[key];
                if (existingData && existingData.password === password) {
                    data = existingData.data;
                }
                return data;
            }
        },

        /**
         * Removes cached data that was previously stored.
         * @param {string} key - The unique identifier of the data that should be removed
         * @param {string} [password] - The secret key needed to flush the data
         */
        flushData: function (key, password) {
            var existingData;

            if (!this._started) {
                throw this._constructErrorMessage(this._errors.notStarted);
            }

            existingData = this._cachedData[key];

            if (existingData && existingData.password === password) {
                delete this._cachedData[key];
            }
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
         * Deletes all cached data. Use with caution!
         */
        flushAll: function () {
            this._cachedData = {};
        }

    };

    return new CacheManager();

});