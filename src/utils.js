define(function () {
    "use strict";

    /**
     * Random, but helpful, utilities.
     * @name Utils
     * @namespace
     */
    var Utils = /** @lends Utils */{

        /**
         * Gets a deeply nested property of an object.
         * @param {object} obj - The object to evaluate
         * @param {string} map - A string denoting where the property that should be extracted exists
         * @param {object} fallback - The fallback if the property does not exist
         */
        getNested: function (obj, map, fallback) {
            var mapFragments = map.split('.'),
                val = obj;
            for (var i = 0; i < mapFragments.length; i++) {
                if (val[mapFragments[i]]) {
                    val = val[mapFragments[i]];
                } else {
                    val = fallback;
                }
            }
            return val;
        },

        /**
         * Merges the contents of two or more objects.
         * @param {object} obj - The target object
         * @param {...object} - Additional objects who's properties will be merged in
         */
        extend: function (target) {
            var merged = target,
                source, i;
            for (i = 1; i < arguments.length; i++) {
                source = arguments[i];
                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        merged[prop] = source[prop];
                    }
                }
            }
            return merged;
        }
    };

    return Utils;
});
