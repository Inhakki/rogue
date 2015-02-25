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
    }
};

