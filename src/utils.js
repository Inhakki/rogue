'use strict';

var ElementKit = require('element-kit');

module.exports = {
    /**
     * Triggers a method on an html collection.
     * @param {HTMLCollection} els - A collection of elements
     * @param {string} method - The method to call on each of the elements
     * @param {Array} [params] - An array of parameters in which the pass to the method
     */
    triggerHtmlCollectionMethod: function (els, method, params) {
        var count = els.length,
            i, el;
        for (i = 0; i < count; i++) {
            el = els[i];
            el.kit[method].apply(el.kit, params);
        }
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
    },

    /**
     * Gets a deeply nested property of an object.
     * @param {object} obj - The object to evaluate
     * @param {string} map - A string denoting where the property that should be extracted exists
     * @param {object} [fallback] - The fallback if the property does not exist
     */
    getNested: function (obj, map, fallback) {
        var mapFragments = map.split('.'),
            val = obj;
        for (var i = 0; i < mapFragments.length; i++) {
            if (val[mapFragments[i]]) {
                val = val[mapFragments[i]];
            } else {
                val = fallback;
                break;
            }
        }
        return val;
    },

    /**
     * Sets a nested property on an object, creating empty objects as needed to avoid undefined errors.
     * @param {object} obj - The initial object
     * @param {string} map - A string denoting where the property that should be set exists
     * @param {*} value - New value to set
     * @example utils.setNested(obj, 'path.to.value.to.set', 'newValue');
     */
    setNested: function (obj, map, value) {
        var mapFragments = map.split('.'),
            val = obj;
        for (var i = 0; i < mapFragments.length; i++) {
            var isLast = i === (mapFragments.length - 1);
            if (!isLast) {
                val[mapFragments[i]] = val[mapFragments[i]] || {};
                val = val[mapFragments[i]];
            } else {
                val[mapFragments[i]] = value;
            }
        }
        return value;
    }
};

