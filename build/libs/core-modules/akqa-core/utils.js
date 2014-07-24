var utils = {};

/**
 * Gets a deeply nested property of an object.
 * @param {object} obj - The object to evaluate
 * @param {string} map - A string denoting where the property that should be extracted exists
 * @param {object} fallback - The fallback if the property does not exist
 */
utils.getNested = function (obj, map, fallback) {
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
};

/**
 * Sets a nested property on an object, creating empty objects as needed to avoid undefined errors.
 * @param {object} obj - The initial object
 * @param {string} map - A string denoting where the property that should be set exists
 * @param {*} value - New value to set
 * @example utils.setNested(obj, 'path.to.value.to.set', 'newValue');
 */
utils.setNested = function (obj, map, value) {
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
};

/**
 * Merges the contents of two or more objects.
 * @param {object} obj - The target object
 * @param {...object} - Additional objects who's properties will be merged in
 */
utils.extend = function (target) {
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
};


// make this class useable for both node (backend) and frontend
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
} else {
    define(utils);
}