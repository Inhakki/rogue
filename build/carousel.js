/** 
* rogue - v2.8.1.
* git://github.com/mkay581/rogue.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Rogue = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Element = require('./element');
var ImageElement = require('./image-element');

var elementCount = 0, cache = {}, loaded;

module.exports = (function () {

    var ElementKit = function (options) {
        this.initialize(options);
    };
    ElementKit.prototype = {
        /**
         * Does a little setup for element kit.
         */
        initialize: function () {

            var self = this;
            // can only define the element property once or an exception will be thrown
            // must also check if element kit was loaded by some other module dependency
            if (!loaded && !document.body.kit) {
                // make element kit available on ALL DOM Elements when they are created
                loaded = Object.defineProperty(window.Element.prototype, 'kit', {
                    get: function () {
                        return self.setup(this);
                    }
                });
            }
        },

        /**
         * Sets up the kit on an element.
         * @param {HTMLElement} el - The element in which to load the kit onto
         * @returns {Element|ImageElement} Returns the element instance
         */
        setup: function (el) {
            var ElementClass;
            // only add a new instance of the class if it hasnt already been added
            if (!cache[el._kitId]) {
                ElementClass = el instanceof window.HTMLImageElement ? ImageElement : Element;
                elementCount++;
                el._kitId = elementCount;
                cache[el._kitId] = new ElementClass(el);
            }
            return cache[el._kitId];
        },
        /**
         * Destroys element kit.
         */
        destroy: function () {}

    };

    return new ElementKit();

})();
},{"./element":2,"./image-element":3}],2:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var ElementKit = require('./element-kit');

var Element = function (el) {
    this.initialize(el);
};

/**
 * A class from which all Elements are based.
 * @description Bootstraps an element to allow for native JS methods (see https://developer.mozilla.org/en-US/docs/Web/API/Element)
 * @class Element
 * @param {Element} el - The element
 */
Element.prototype = /** @lends Element */{

    initialize: function (el) {
        this.el = el;
        this.classList = this._getClassList();
        this._eventListenerMap = this._eventListenerMap || [];

        Object.defineProperty(this, 'dataset', {
            get: function () {
                return this.getData();
            }.bind(this)
        });
    },

    /**
     * Bubbles up each parent node of the element, triggering the callback on each element until traversal
     * either runs out of parent nodes, reaches the document element, or if callback returns a falsy value
     * @param {Function} callback - A callback that fires which gets passed the current element
     * @param {HTMLElement} [startEl] - The element where traversal will begin (including the passed element), defaults to current el
     * @private
     */
    _traverseEachParent: function (callback, startEl) {
        var parentNode = startEl || this.el,
            predicate;
        // check if the node has classname property, if not, we know we're at the #document element
        while (parentNode && typeof parentNode.className === 'string') {
            predicate = callback(parentNode);
            if (predicate !== undefined && !predicate) {
                break;
            }
            parentNode = parentNode.parentNode;
        }
    },

    /**
     * Wrap a parent container element around the element.
     * @param {string} html - The wrapper html
     */
    appendOuterHtml: function (html) {
        var parent = this.el.parentNode,
            container = utils.createHtmlElement(html);
        if (parent) {
            parent.replaceChild(container, this.el);
        } else {
            parent = document.createDocumentFragment();
            parent.appendChild(container);
        }
        container.appendChild(this.el);
        return container;
    },

    /**
     * Retrieves the unique identifier of the element.
     * @private
     */
    getUniqueId: function () {
        return this.el._kitId;
    },

    /**
     * Gets the closest ancestor element that has a css class.
     * @param {string} className - The class name that the ancestor must have to match
     */
    getClosestAncestorElementByClassName: function (className) {
        var result;
        this._traverseEachParent(function (parent) {
            if (parent.kit._hasClass(className)) {
                result = parent;
                return false;
            }
        }, this.el.parentNode);
        return result;
    },

    /**
     * Adds an event listener to the element.
     * @param {string} event - The event to listen to
     * @param {string|Function} listener - The name of the function (or the function itself) that should fire when the event happens
     * @param {Object} [context] - The context in which the function should be called
     * @param {Object} [options] - Object containing additional options
     * @param {Object} [options.useCapture] - Whether to use capture (see Web.API.EventTarget.addEventListener)
     */
    addEventListener: function (event, listener, context, options) {
        var _listener = listener;
        options = options || {};

        if (typeof _listener !== 'function') {
            _listener = this._createEventListener(context[listener], context);
        }

        this.el.addEventListener(event, _listener, options.useCapture);

        this._eventListenerMap.push({
            event: event,
            listener: _listener,
            listenerId: listener,
            context: context
        });
    },

    /**
     * Creates an event listener bounded to a context (useful for adding and removing events).
     * @param {Function} listener - The listener function
     * @param {Object} context - The context that should be used when the function is called
     * @returns {Function} Returns an event listener function bounded to the context
     * @private
     */
    _createEventListener: function (listener, context) {
        return function (e) {
            context = context || this;
            listener.apply(context, arguments);
        }
    },

    /**
     * Removes an event listener from the element.
     * @param {string} event - The event to remove
     * @param {string|Function} listener - The event listener function or (name of it) to be removed
     * @param {Object} [context] - The context of the listener that is being removed
     */
    removeEventListener: function (event, listener, context) {
        var map = this._eventListenerMap || [],
            i,
            obj;

        if (map.length) {
            for (i = 0; i < map.length; i++) {
                obj = map[i];
                if (obj && obj.event === event && obj.listenerId === listener && obj.context === context) {
                    this.el.removeEventListener(event, obj.listener);
                    this._eventListenerMap[i] = null;
                    break;
                }
            }
        }
    },

    /**
     * Builds a transition promise that waits to resolve until the el's CSS transition is completed.
     * @param {Function} callback - The callback that is fired when the transition time is complete
     * @returns {HTMLElement} Returns the html element
     */
    waitForTransition: function (callback) {
        var duration = this.getTransitionDuration();
        if (callback) {
            if (duration > 0) {
                setTimeout(callback.bind(this, this.el), duration);
            } else {
                callback(this.el);
            }
        }
    },

    /**
     * Gets the time is takes for the element to transition to its show state.
     * @returns {Number} Returns the total CSS transition time in milliseconds
     */
    getTransitionDuration: function () {
        var delayProp = this.getCssComputedProperty('transition-delay') || '0ms',
            durationProp = this.getCssComputedProperty('transition-duration') || '0ms',
            times = Array.isArray(durationProp) ? durationProp : [durationProp],
            delay = Array.isArray(delayProp) ? delayProp : [delayProp],
            highest = 0,
            map;

        times.push.apply(times, delay); // account for delay

        // calculate highest number of time
        times.forEach(function (value) {
            value.split(',').forEach(function (v) {
                v = this._convertCssTimeValueToMilliseconds(v);
                map = this._getCssPropUnitMap(v);
                if (map.num > highest) {
                    highest = map.num;
                }
            }.bind(this));
        }.bind(this));

        return highest;
    },

    /**
     * Gets the computed property of the element.
     * @param {string} prop - The name of the property to get
     * @returns {string} Returns the value of the property
     */
    getCssComputedProperty: function (prop) {
        var style = window.getComputedStyle(this.el);
        return style.getPropertyValue(prop) || this.el.style[this._getJsPropName(prop)];
    },

    /**
     * Takes a value and separates the number and unit into a key/value map.
     * @param v - The value
     * @returns {{num: Number, unit: string}} Returns the map
     * @private
     */
    _getCssPropUnitMap: function (v) {
        v.trim();
        var num = v.match('[0-9\.]+'),
            unit = 'ms';

        num = num ? num[0] : '';
        if (num) {
            unit = v.split(num)[1];
            num = Number(num);
        }
        return {
            num: num,
            unit: unit
        };
    },

    /**
     * Converts a css timing unit value into milliseconds.
     * @param {string} val - The value string
     * @returns {string} Returns the timing unit value in milliseconds
     * @private
     */
    _convertCssTimeValueToMilliseconds: function (val) {
        var number = this._getCssPropUnitMap(val).num,
            unit = val.replace(number, '');
        if (unit === 's') {
            val = number * 1000;
        } else {
            val = number;
        }
        return val + 'ms';
    },

    /**
     * Gets the class list of an element.
     * @returns {Array} Returns an array of class names.
     * @private
     */
    _getClassList: function () {
        return {
            add: this._addClass.bind(this),
            remove: this._removeClass.bind(this),
            contains: this._hasClass.bind(this),
            toggle: this._toggleClass.bind(this)
        };
    },

    /**
     * Gets the class list of an element.
     * @returns {Array} Returns an array of class names.
     * @private
     */
    _getCssClasses: function () {
        return this.el.className.split(' ');
    },

    /**
     * Toggles (adds/removes) a css class on the element.
     * @param {string} className - The css class value to add/remove
     * @private
     */
    _toggleClass: function (className) {
        if (!this._hasClass(className)) {
            this._addClass(className);
        } else {
            this._removeClass(className);
        }
    },

    /**
     * Adds a CSS class to the element.
     * @param {...string} arguments - The arguments containing css classes to add
     * @private
     */
    _addClass: function  () {
        if (('classList' in document.createElement('_'))) {
            // browser supports classList!
            this._each(arguments, function (className) {
                this.el.classList.add(className);
            }.bind(this));
        } else {
            this._each(arguments, function (className) {
                if (!this._hasClass(className)) {
                    this.el.className = this.el.className ? this.el.className + ' ' + className : className;
                }
            }.bind(this));
        }
    },

    /**
     * Triggers a callback function for a set of items.
     * @param {Array} items - An array of items
     * @param {Function} method - The function to execute for each item
     * @private
     */
    _each: function (items, method) {
        var count = items.length,
            i;
        for (i = 0; i < count; i++) {
            method(items[i]);
        }
    },

    /**
     * Removes a CSS class from the element.
     * @param {...string} arguments - The arguments containing css classes to remove
     * @private
     */
    _removeClass: function () {
        var re;
        if ('classList' in document.createElement('_')) {
            this._each(arguments, function (className) {
                this.el.classList.remove(className);
            }.bind(this));
        } else {
            this._each(arguments, function (className) {
                if (this.el.className === className) {
                    // if the only class that exists,  remove it and make empty string
                    this.el.className = '';
                } else {
                    re = '[\\s]*' + className;
                    re = new RegExp(re, 'i');
                    this.el.className = this.el.className.replace(re, '');
                }
            }.bind(this));
        }
    },

    /**
     * Checks if the element has a class.
     * @param {string} className - The css class value to check
     * @private
     */
    _hasClass: function (className) {
        var classes = this._getCssClasses();
        return classes.indexOf(className) !== -1;
    },

    /**
     * Takes a css property name and returns the javascript version of it.
     * @param {string} cssProp - The css property
     * @returns {string} Returns the javascript version
     * @private
     */
    _getJsPropName: function (cssProp) {
        // convert to camelCase
        cssProp = cssProp.replace(/-([a-z])/g, function (letter) {
            return letter[1].toUpperCase();
        });
        return cssProp;
    },

    /**
     * Gets a simplified mapping of all attributes of an element.
     * @returns {object} - Returns an object containing all attribute mappings
     */
    getAttributes: function () {
        var attrs = this.el.attributes,
            map = {};
        if (attrs.length) {
            for (var i = 0; i < attrs.length; i++) {
                map[attrs[i].name] = attrs[i].value;
            }
        }
        return map;
    },

    /**
     * Gets the elements current data attributes that have been assigned in the DOM.
     * @returns {{}}
     * @private
     */
    _getDomData: function () {
        var attrs = this.getAttributes(), data = {}, key, value;
        for (key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                value = attrs[key];
                if (key.indexOf('data-') === 0) {
                    // data attribute found!
                    key = key.substr(5);
                    data[key] = value;
                }
            }
        }
        return data;
    },

    /**
     * Returns an object of the element's current data attributes.
     * @returns {*|{}}
     */
    getData: function () {
        var key;

        this._data = utils.extend({}, this._data, this._getDomData());

        // convert all current data properties to be "watchable".
        for (key in this._data) {
            if (this._data.hasOwnProperty(key)) {
                var value = this._data[key];
                // TODO: we should only convert it if it isnt already a "watchable" obj
                Object.defineProperty(this._data, key, {
                    writeable: true,
                    get: function () {
                        return value;
                    }.bind(this),
                    set: function (value) {
                        this.setData.bind(this, key, value)
                    }.bind(this)
                });
            }
        }
        return this._data;

    },

    /**
     * When data is being set.
     * @param {string} key - The key of which to be set
     * @param {*} value - The value
     */
    setData: function (key, value) {
        this.el.setAttribute('data-' + key, value);
        this._data[key] = value;

    },

    /**
     * Destroys the kit on the element.
     */
    destroy: function () {}
};

module.exports = Element;
},{"./element-kit":1,"./utils":4}],3:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var Element = require('./element');

/**
 * A class from which all image elements are based.
 * @class ImageElement
 * @param {Element} el - The element
 * @todo: find a more simple way to extend Element class along with its prototypes
 */
var ImageElement = function (el) {
    Element.prototype.initialize.call(this, el);
};
ImageElement.prototype = utils.extend({}, Element.prototype, {
    /**
     * Loads the image asset from a provided source url.
     * @param {string} srcAttr - The attribute on the element which has the image source url
     * @param {Function} [callback] - The callback fired when the image has loaded
     */
    load: function (srcAttr, callback) {
        var el = this.el,
            src = el.getAttribute(srcAttr);

        if (!src) {
            console.warn('ElementKit error: ImageElement has no "' + srcAttr + '" attribute to load');
        }

        if (src.indexOf(',') !== -1) {
            // image is a srcset!
            src = this._getImageSourceSetPath(src);
        }
        this._loadImage(src, callback);
        return this;
    },

    /**
     * Loads an image in a virtual DOM which will be cached in the browser and shown.
     * @param {string} src - The image source url
     * @param {Function} callback - Function that is called when image has loaded
     * @param {HTMLImageElement} [el] - Optional image element to load the image onto
     * @returns {string} Returns the image url source
     * @private
     */
    _loadImage: function (src, callback) {
        var img = this.el;
        img.onload = callback || function(){};
        img.src = src;
        return src;
    },

    /**
     * Sniffs srcset attribute and detects the images viewport size to return the correct source image to display
     * FYI: browsers do have this functionality natively but some of them have it turned by default (Firefox, IE, etc)
     * @param {string} srcSet - The source set attribute
     * @returns {string} Returns the source image path
     * @private
     */
    _getImageSourceSetPath: function (srcSet) {
        var viewportWidth = window.innerWidth,
            viewportHeight = window.innerHeight,
            src,
            widthHeightMap,
            width,
            height,
            found;
        srcSet.split(',').forEach(function (str) {
            widthHeightMap = this._buildSourceMapWidthHeight(str);
            width = widthHeightMap.width || 0;
            height = widthHeightMap.height || 0;
            if (!found && viewportWidth >= width && viewportHeight >= height) {
                src = str.split(' ')[0];
                found = true;
            }
        }.bind(this));
        return src;
    },

    /**
     * Builds a mapping of width and height within a srcset attribute.
     * @param {String} str - The srcset attribute string
     * @param {Object} [map] - The object that width and height keys will be attached to
     * @returns {*|{}}
     * @private
     */
    _buildSourceMapWidthHeight: function (str, map) {
        var frags = str.split(' '),
            attrId,
            getNumber = function (frag) {
                return Number(frag.substr(0, frag.length - 1))
            };

        map = map || {};

        frags.shift(); // remove first item since we know it is the filename

        frags.forEach(function (frag) {
            attrId = frag.charAt(frag.length - 1);
            if (attrId === 'w') {
                map.width = getNumber(frag);
            } else if (attrId === 'h') {
                map.height = getNumber(frag);
            }
        });
        return map;
    }

});

module.exports = ImageElement;
},{"./element":2,"./utils":4}],4:[function(require,module,exports){
module.exports = {
    /**
     * Creates an HTML Element from an html string.
     * @param {string} html - String of html
     * @returns {HTMLElement} - Returns and html element node
     */
    createHtmlElement: function (html) {
        var tempParentEl,
            el;
        if (html) {
            html = html.trim(html);
            tempParentEl = document.createElement('div');
            tempParentEl.innerHTML = html;
            el = tempParentEl.childNodes[0];
            return tempParentEl.removeChild(el);
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
},{}],5:[function(require,module,exports){
'use strict';
var utils = require('utils');
var ElementKit = require('element-kit');
/**
 * A callback function that fires after a new active panel is set
 * @callback CarouselPanels~onChange
 * @param {Number} index - The index of the new panel
 */

/**
 * Adds functionality for carousel panels. Not really meant to be used own its own, unless you want
 * to customize the the javascript logic for the "panels" of the Carousel (assuming that you actually
 * know what you're doing when you do so).
 * @constructor CarouselPanels
 * @param {object} options - Options passed into instance
 * @param {HTMLCollection} options.panels - The panels in which to use for the carousel (an array of photos)
 * @param {string} [options.assetClass] - The CSS class of the asset images inside of the DOM
 * @param {string} [options.assetLoadingClass] - The CSS class that gets added to an asset when it is loading
 * @param {boolean} [options.autoLoadAssets] - Whether or not to automatically load assets when active
 * @param {string} [options.panelActiveClass] - The CSS class that gets added to an panel when it becomes active
 * @param {CarouselPanels~onChange} [options.onChange] - When the current panel is changed
 * @param {string} [options.lazyLoadAttr] - The attribute containing the url path to content that is to be lazy loaded
 */
var CarouselPanels = function (options) {
    this.initialize(options);
};

CarouselPanels.prototype = {

    /**
     * When the carousel is instantiated.
     */
    initialize: function (options) {

        this.options = utils.extend({
            panels: [],
            assetClass: null,
            assetLoadingClass: 'carousel-asset-loading',
            autoLoadAssets: true,
            panelActiveClass: 'carousel-panel-active',
            onChange: null,
            lazyLoadAttr: 'data-src'
        }, options);

        this._checkForInitErrors();
    },

    /**
     * Checks for errors upon initialize.
     * @memberOf CarouselPanels
     * @private
     */
    _checkForInitErrors: function () {
        var options = this.options,
            panelCount = options.panels.length;
        if (!panelCount) {
            console.error('carousel error: no panels were passed in constructor');
        }
    },

    /**
     * Transitions to a panel of an index.
     * @param {Number} index - The index number to go to
     * @memberOf CarouselPanels
     */
    goTo: function (index) {

        var maxIndex = this.options.panels.length - 1,
            minIndex = 0,
            prevIndex = this.getCurrentIndex();

        if (index > maxIndex || index < minIndex) {
            console.error('carousel panel error: unable to transition to an index of ' + index + 'which does not exist!');
        }

        if (prevIndex === undefined || prevIndex !== index) {

            this._updatePanels(index);

            this._currentIndex = index;

            if (this.options.onChange) {
                this.options.onChange(index)
            }
        }
    },

    /**
     * Makes all panels inactive except for the one at the index provided.
     * @param {Number} index - The new index
     * @memberOf CarouselPanels
     * @private
     */
    _updatePanels: function (index) {
        var panels = this.options.panels,
            prevIndex = this.getCurrentIndex();
        if (prevIndex !== undefined) {
            panels[prevIndex].kit.classList.remove(this.options.panelActiveClass);
        }
        panels[index].kit.classList.add(this.options.panelActiveClass);
        if (this.options.autoLoadAssets) {
            this.loadPanelAssets(index);
        }
    },

    /**
     * Gets the current index that is showing.
     * @returns {Number} Returns the index
     * @memberOf CarouselPanels
     */
    getCurrentIndex: function () {
        return this._currentIndex;
    },

    /**
     * Loads assets for a given panel.
     * @param {Number} index - The index of the panel containing the assets to load
     * @memberOf CarouselPanels
     */
    loadPanelAssets: function (index) {
        var panel = this.options.panels[index],
            assets = this.options.assetClass ? panel.getElementsByClassName(this.options.assetClass) : [panel],
            i,
            count = assets.length,
            el;
        for (i = 0; i < count; i++) {
            el = assets[i];
            if (el.getAttribute(this.options.lazyLoadAttr)) {
                if (el.tagName.toLowerCase() === 'img') {
                    this._loadImageAsset(el);
                } else {
                    console.warn('carousel error: no matching img elements to lazy load. try supplying a valid assetClass option to constructor');
                }
            }
        }
    },

    /**
     * Manually lazy loads a resource using an element's data attribute.
     * @param {HTMLElement} el - The image element to load
     * @param {Function} [callback] - A function that fires when the asset is done loading
     * @private
     * @memberOf CarouselPanels
     */
    _loadImageAsset: function (el, callback) {
        var img = new Image(),
            src = el.getAttribute(this.options.lazyLoadAttr),
            loadingClass = this.options.assetLoadingClass;

        el.kit.classList.add(loadingClass);

        img.onload = function() {
            el.src = src;
            el.kit.classList.remove(loadingClass);
            callback ? callback() : null;
        };
        img.src = src;
    },

    /**
     * Final cleanup of instance.
     * @memberOf CarouselPanels
     */
    destroy: function () {
        var options = this.options;
        options.panels[this.getCurrentIndex()].kit.classList.remove(options.panelActiveClass);
        this._currentIndex = null;
    }
};

module.exports = CarouselPanels;
},{"element-kit":1,"utils":8}],6:[function(require,module,exports){
'use strict';
var utils = require('utils');
var ElementKit = require('element-kit');

/**
 * A callback function that fires after a new active panel is set
 * @callback CarouselThumbs~onChange
 * @param {Number} index - The index of the new panel
 */

/**
 * Adds thumbnails for carousel. Not really meant to be used own its own, unless you
 * want to customize the javascript logic for the "thumbnails" of your Carousel instance (assuming that you actually
 * know what you're doing when you do so).
 * @class CarouselThumbs
 * @param {object} options - Options passed into instance
 * @param {HTMLCollection} [options.thumbnails] - A collection of elements that are the thumbnails
 * @param {string} [options.thumbnailActiveClass] - The CSS class that gets added to a thumbnail element when it becomes active
 * @param {CarouselThumbs~onChange} [options.onChange] - When a new thumbnail becomes active
 */
var CarouselThumbs = function (options) {
    this.initialize(options);
};

CarouselThumbs.prototype = {

    /**
     * When carousel is instantiated.
     * @param options
     * @memberOf CarouselThumbs
     */
    initialize: function (options) {

        this.options = utils.extend({
            thumbnails: [],
            thumbnailActiveTriggerEvent: 'click',
            thumbnailActiveClass: 'carousel-thumbnail-active',
            onChange: null
        }, options);

        this.setup();

    },

    /**
     * Sets up the carousel instance by adding event listeners to the thumbnails.
     * @memberOf CarouselThumbs
     */
    setup: function () {
        var thumbs = this.options.thumbnails;
        if (thumbs.length) {
            utils.triggerHtmlCollectionMethod(thumbs, 'addEventListener', [
                this.options.thumbnailActiveTriggerEvent,
                'onThumbnailEvent',
                this
            ]);
        } else {
            console.error('carousel thumb error: no thumbnails were passed to constructor');
        }
    },

    /**
     * When a thumbnail is clicked.
     * @param {MouseEvent} e - The click event
     * @memberOf CarouselThumbs
     */
    onThumbnailEvent: function (e) {
        if (!this._thumbnailArr) {
            // convert thumbnail HTMLCollection to real array so we can perform necessary array methods
            this._thumbnailArr = Array.prototype.slice.call(this.options.thumbnails);
        }
        var index = this._thumbnailArr.indexOf(e.currentTarget);
        if (index !== -1 && index !== this.getCurrentIndex()) {
            if (this.options.onChange) {
                this.options.onChange(index);
            }
        }
    },

    /**
     * Checks for errors upon initialize.
     * @memberOf CarouselThumbs
     * @private
     */
    _checkForInitErrors: function () {
        var options = this.options,
            thumbnailCount = options.thumbnails.length;
        if (!thumbnailCount) {
            console.error('carousel error: no thumbnails were passed in constructor');
        }
    },

    /**
     * Makes all thumbnails inactive except for the one at the index provided.
     * @param {Number} index - The new index
     * @memberOf CarouselThumbs
     */
    goTo: function (index) {
        var thumbs = this.options.thumbnails,
            prevIndex = this.getCurrentIndex() || 0,
            activeClass = this.options.thumbnailActiveClass,
            maxIndex = thumbs.length - 1,
            minIndex = 0;

        if (index > maxIndex || index < minIndex) {
            console.error('carousel thumbnail error: unable to transition to a thumbnail with an index of ' + index + ', it does not exist!');
        }

        thumbs[index].kit.classList.add(activeClass);

        if (prevIndex !== index) {
            thumbs[prevIndex].kit.classList.remove(activeClass);
        }
        this._currentIndex = index;
    },

    /**
     * Gets the current thumbnail index that is showing.
     * @returns {Number} Returns the index
     * @memberOf CarouselThumbs
     */
    getCurrentIndex: function () {
        return this._currentIndex;
    },

    /**
     * Destroys the instance.
     * @memberOf CarouselThumbs
     */
    destroy: function () {
        var options = this.options,
            thumbs = options.thumbnails;

        this._currentIndex = null;

        if (thumbs.length) {
            utils.triggerHtmlCollectionMethod(thumbs, 'removeEventListener', [
                options.thumbnailActiveTriggerEvent,
                'onThumbnailEvent',
                this
            ]);
        }
    }
};

module.exports = CarouselThumbs;
},{"element-kit":1,"utils":8}],7:[function(require,module,exports){
'use strict';
var utils = require('./utils');
var CarouselPanels = require('./carousel-panels');
var CarouselThumbs = require('./carousel-thumbs');
var ElementKit = require('element-kit');
/**
 * A callback function that fires after a new active panel is set
 * @callback Carousel~onPanelChange
 * @param {Number} index - The index of the new panel
 */

/**
 * Adds carousel functionality to a set up pre-determined HTML markup.
 * @class Carousel
 * @param {object} options - Options passed into instance
 * @param {HTMLCollection} options.panels - The panels in which to use for the carousel (an array of photos)
 * @param {string} [options.assetClass] - The CSS class of the asset images inside of the DOM
 * @param {string} [options.assetLoadingClass] - The CSS class that gets added to an asset when it is loading
 * @param {boolean} [options.autoLoadAssets] - Whether or not to automatically load assets when active
 * @param {string} [options.panelActiveClass] - The CSS class that gets added to an panel when it becomes active
 * @param {Carousel~onPanelChange} [options.onPanelChange] - When the current panel is changed
 * @param {string} [options.lazyLoadAttr] - The attribute containing the url path to content that is to be lazy loaded
 * @param {HTMLCollection} [options.thumbnails] - A collection of elements that are the thumbnails
 * @param {string} [options.thumbnailActiveClass] - The CSS class that gets added to a thumbnail element when it becomes active
 * @param {Number} [options.initialIndex] - The index of the panel to go to upon instantiation (if not declared, goTo() must be called manually).
 */
var Carousel = function (options) {
    this.initialize(options);
};

Carousel.prototype = {

    /**
     * Sets up stuff.
     * @param options
     */
    initialize: function (options) {

        this.options = utils.extend({
            panels: [],
            assetClass: null,
            assetLoadingClass: 'carousel-asset-loading',
            autoLoadAssets: true,
            panelActiveClass: 'carousel-panel-active',
            onPanelChange: null,
            lazyLoadAttr: 'data-src',
            thumbnails: [],
            thumbnailActiveTriggerEvent: 'click',
            thumbnailActiveClass: 'carousel-thumbnail-active',
            initialIndex: 0
        }, options);

        this._checkForInitErrors();
        this.setup();
    },

    /**
     * Sets up the carousel instance by adding event listeners to the thumbnails.
     * @memberOf Carousel
     */
    setup: function () {

        this.panels = new CarouselPanels(utils.extend({}, this.options, {
            onChange: this.onPanelChange.bind(this)
        }));

        if (this.options.thumbnails.length) {
            this.thumbnails = new CarouselThumbs(utils.extend({}, this.options, {
                onChange: this.onThumbnailChange.bind(this)
            }));
        }

        if (typeof this.options.initialIndex === 'number') {
            this.goTo(this.options.initialIndex);
        }
    },

    /**
     * Checks for errors upon initialize.
     * @private
     * @memberOf Carousel
     */
    _checkForInitErrors: function () {
        var options = this.options,
            panelCount = options.panels.length,
            thumbnailCount = options.thumbnails.length;
        if (thumbnailCount && thumbnailCount !== panelCount) {
            console.warn('carousel warning: number of thumbnails passed in constructor do not equal the number of panels' + '\n' +
            'panels: ' + panelCount + '\n' +
            'thumbnails: ' + thumbnailCount + '\n');
        }
    },

    /**
     * When a panel index changes.
     * @param {Number} index - The new index
     * @memberOf Carousel
     */
    onPanelChange: function (index) {
        if (this.thumbnails) {
            this.thumbnails.goTo(index);
        }
        if (this.options.onPanelChange) {
            this.options.onPanelChange(index)
        }
    },

    /**
     * When the thumbnail index changes.
     * @param {Number} index - The new index
     * @memberOf Carousel
     */
    onThumbnailChange: function (index) {
        this.goTo(index);
    },

    /**
     * Transition to a new panel and thumbnail.
     * @param {Number} index - The index number to go to
     * @memberOf Carousel
     */
    goTo: function (index) {
        var options = this.options,
            maxIndex = options.panels.length - 1,
            minIndex = 0;

        if (index > maxIndex) {
            // set to first index if too high
            index = minIndex;
        } else if (index < minIndex) {
            // set to last index if too low
            index = maxIndex;
        }

        this.panels.goTo(index);

        if (this.thumbnails) {
            this.thumbnails.goTo(index);
        }
    },

    /**
     * Transitions the carousel to a panel of an index.
     * @param {Number} index - The index number to go to
     * @deprecated since 2.2.2
     * @memberOf Carousel
     */
    goToPanel: function (index) {
        this.goTo(index);
    },

    /**
     * Gets the current index that is showing.
     * @returns {Number} Returns the index
     * @memberOf Carousel
     */
    getCurrentIndex: function () {
        return this.panels.getCurrentIndex();
    },

    /**
     * Destroys the carousel.
     * @memberOf Carousel
     */
    destroy: function () {
        this.panels.destroy();
        if (this.thumbnails) {
            this.thumbnails.destroy();
        }
    }
};

module.exports = Carousel;
},{"./carousel-panels":5,"./carousel-thumbs":6,"./utils":8,"element-kit":1}],8:[function(require,module,exports){
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


},{"element-kit":1}]},{},[7])(7)
});