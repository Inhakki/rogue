/** 
* rogue - v2.6.3.
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
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
'use strict';

module.exports = require('./lib/core.js')
require('./lib/done.js')
require('./lib/es6-extensions.js')
require('./lib/node-extensions.js')
},{"./lib/core.js":7,"./lib/done.js":8,"./lib/es6-extensions.js":9,"./lib/node-extensions.js":10}],7:[function(require,module,exports){
'use strict';

var asap = require('asap')

module.exports = Promise;
function Promise(fn) {
  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
  if (typeof fn !== 'function') throw new TypeError('not a function')
  var state = null
  var value = null
  var deferreds = []
  var self = this

  this.then = function(onFulfilled, onRejected) {
    return new self.constructor(function(resolve, reject) {
      handle(new Handler(onFulfilled, onRejected, resolve, reject))
    })
  }

  function handle(deferred) {
    if (state === null) {
      deferreds.push(deferred)
      return
    }
    asap(function() {
      var cb = state ? deferred.onFulfilled : deferred.onRejected
      if (cb === null) {
        (state ? deferred.resolve : deferred.reject)(value)
        return
      }
      var ret
      try {
        ret = cb(value)
      }
      catch (e) {
        deferred.reject(e)
        return
      }
      deferred.resolve(ret)
    })
  }

  function resolve(newValue) {
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then
        if (typeof then === 'function') {
          doResolve(then.bind(newValue), resolve, reject)
          return
        }
      }
      state = true
      value = newValue
      finale()
    } catch (e) { reject(e) }
  }

  function reject(newValue) {
    state = false
    value = newValue
    finale()
  }

  function finale() {
    for (var i = 0, len = deferreds.length; i < len; i++)
      handle(deferreds[i])
    deferreds = null
  }

  doResolve(fn, resolve, reject)
}


function Handler(onFulfilled, onRejected, resolve, reject){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.resolve = resolve
  this.reject = reject
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}

},{"asap":11}],8:[function(require,module,exports){
'use strict';

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, function (err) {
    asap(function () {
      throw err
    })
  })
}
},{"./core.js":7,"asap":11}],9:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

function ValuePromise(value) {
  this.then = function (onFulfilled) {
    if (typeof onFulfilled !== 'function') return this
    return new Promise(function (resolve, reject) {
      asap(function () {
        try {
          resolve(onFulfilled(value))
        } catch (ex) {
          reject(ex);
        }
      })
    })
  }
}
ValuePromise.prototype = Promise.prototype

var TRUE = new ValuePromise(true)
var FALSE = new ValuePromise(false)
var NULL = new ValuePromise(null)
var UNDEFINED = new ValuePromise(undefined)
var ZERO = new ValuePromise(0)
var EMPTYSTRING = new ValuePromise('')

Promise.resolve = function (value) {
  if (value instanceof Promise) return value

  if (value === null) return NULL
  if (value === undefined) return UNDEFINED
  if (value === true) return TRUE
  if (value === false) return FALSE
  if (value === 0) return ZERO
  if (value === '') return EMPTYSTRING

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        return new Promise(then.bind(value))
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex)
      })
    }
  }

  return new ValuePromise(value)
}

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr)

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { res(i, val) }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) { 
    reject(value);
  });
}

Promise.race = function (values) {
  return new Promise(function (resolve, reject) { 
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    })
  });
}

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
}

},{"./core.js":7,"asap":11}],10:[function(require,module,exports){
'use strict';

//This file contains then/promise specific extensions that are only useful for node.js interop

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity
  return function () {
    var self = this
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop()
      }
      args.push(function (err, res) {
        if (err) reject(err)
        else resolve(res)
      })
      var res = fn.apply(self, args)
      if (res && (typeof res === 'object' || typeof res === 'function') && typeof res.then === 'function') {
        resolve(res)
      }
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    var ctx = this
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx)
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) { reject(ex) })
      } else {
        asap(function () {
          callback.call(ctx, ex)
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value)
    })
  }, function (err) {
    asap(function () {
      callback.call(ctx, err)
    })
  })
}

},{"./core.js":7,"asap":11}],11:[function(require,module,exports){
(function (process){

// Use the fastest possible means to execute a task in a future turn
// of the event loop.

// linked list of tasks (single, with head node)
var head = {task: void 0, next: null};
var tail = head;
var flushing = false;
var requestFlush = void 0;
var isNodeJS = false;

function flush() {
    /* jshint loopfunc: true */

    while (head.next) {
        head = head.next;
        var task = head.task;
        head.task = void 0;
        var domain = head.domain;

        if (domain) {
            head.domain = void 0;
            domain.enter();
        }

        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function() {
                   throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    flushing = false;
}

if (typeof process !== "undefined" && process.nextTick) {
    // Node.js before 0.9. Note that some fake-Node environments, like the
    // Mocha test runner, introduce a `process` global without a `nextTick`.
    isNodeJS = true;

    requestFlush = function () {
        process.nextTick(flush);
    };

} else if (typeof setImmediate === "function") {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
        requestFlush = setImmediate.bind(window, flush);
    } else {
        requestFlush = function () {
            setImmediate(flush);
        };
    }

} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    requestFlush = function () {
        channel.port2.postMessage(0);
    };

} else {
    // old browsers
    requestFlush = function () {
        setTimeout(flush, 0);
    };
}

function asap(task) {
    tail = tail.next = {
        task: task,
        domain: isNodeJS && process.domain,
        next: null
    };

    if (!flushing) {
        flushing = true;
        requestFlush();
    }
};

module.exports = asap;


}).call(this,require('_process'))
},{"_process":5}],12:[function(require,module,exports){
var request = require('request');
var utils = require('utils');

'use strict';
/**
 A class to add a simple EventTarget (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) API
 around any object or function, so that it can begin to receive and trigger event listeners.
 @class EventManager
 */

var EventManager = {

    /**
     * Registers a target to begin receiving and triggering events.
     * @param {Object|Function} target - The target
     */
    createTarget: function (target) {
        this._targets = this._targets || {};
        if (!this._targets[target]) {
            target.addEventListener = this._getEventMethod(target, '_addEvent').bind(this);
            target.removeEventListener = this._getEventMethod(target, '_removeEvent').bind(this);
            target.dispatchEvent = this._getEventMethod(target, '_dispatchEvent').bind(this);
            this._targets[target] = {};
        }
    },

    /**
     * Registers a callback to be fired when the url changes.
     * @private
     * @param {Object|Function} target
     * @param {String} eventName
     * @param {Function} listener
     * @param {boolean} useCapture
     * @param {Object} [context]
     */
    _addEvent: function (target, eventName, listener, useCapture, context) {

        if (typeof useCapture !== 'boolean') {
            context = useCapture;
            useCapture = null;
        }

        // replicating native JS default useCapture option
        useCapture = useCapture || false;

        // dont add event listener if target already has it
        var existingListeners = utils.getNested(this._targets[target], eventName, []);
        var listenerObj = {
            listener: listener,
            context: context,
            useCapture: useCapture
        };
        if (existingListeners.indexOf(listenerObj) === -1) {
            var listenerArr = utils.setNested(this._targets[target], eventName, []);
            listenerArr.push(listenerObj);
        }
    },

    /**
     * Returns our internal method for a target.
     * @private
     * @param target
     * @param method
     * @returns {*|function(this:EventManager)}
     */
    _getEventMethod: function (target, method) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(target);
            this[method].apply(this, args);
        }.bind(this);
    },

    /**
     * Removes an event listener from the target.
     * @private
     * @param target
     * @param eventName
     * @param listener
     */
    _removeEvent: function (target, eventName, listener) {
        var existingListeners = utils.getNested(this._targets[target], eventName, []);
        existingListeners.forEach(function (listenerObj, idx) {
            if (listenerObj.listener === listener) {
                existingListeners.splice(idx, 1);
            }
        });
    },

    /**
     * Triggers all event listeners on a target.
     * @private
     * @param {Object|Function} target - The target
     * @param {String} eventName - The event name
     * @param {Object} customData - Custom data that will be sent to the url
     */
    _dispatchEvent: function (target, eventName, customData) {
        var targetObj = this._targets[target] || {},
            e;
        if (targetObj[eventName]) {
            targetObj[eventName].forEach(function (listenerObj) {
                e = this._createEvent(eventName, customData);
                listenerObj.listener.call(listenerObj.context || target, e);
            }.bind(this));
        }
    },

    /**
     * Creates an event.
     * @param {string} eventName - The event name
     * @param {Object} customData - Custom data that will be sent to the url
     * @private
     */
    _createEvent: function (eventName, customData) {
        // For IE 9+ compatibility, we must use document.createEvent() for our CustomEvent.
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(eventName, false, false, customData);
        return evt;
    },

    /**
     * Removes all event listeners from target.
     * @param target
     */
    destroyTarget: function (target) {
        delete this._targets[target];
    }
};

module.exports = EventManager;
},{"request":13,"utils":14}],13:[function(require,module,exports){
'use strict';
var Promise = require('promise');

/**
 * A ES6-Promisified XHR request class to make ajax calls.
 * @module request
 * @type {exports}
 * @param {String} url - The url to be requested
 * @param {Object} [options] - The options
 * @param {String} [options.method] - The method (i.e. "GET", "POST"), defaults to GET
 * @param {Object} [options.headers] - Any headers to send with request
 * @param {Boolean} [options.async] - Whether this is an asynchronous call (default to true)
 * @returns {Promise}
 * @TODO: make this return a promise that follows ES6 Promise syntax
 */
module.exports = function (url, options) {
    var client = new XMLHttpRequest();

    options = options || {};
    options.method = options.method || 'GET';
    options.headers = options.headers || {};
    options.async = typeof options.async === 'undefined' ? true : options.async;


    return new Promise(
        function (resolve, reject) {
            // open connection
            client.open(options.method, url);

            // deal with headers
            for (var i in options.headers) {
                if (options.headers.hasOwnProperty(i)) {
                    client.setRequestHeader(i, options.headers[i]);
                }
            }
            // listener
            client.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve.call(this, this.responseText);
                } else if (this.readyState == 4) {
                    reject.call(this, this.status, this.statusText);
                }
            };
            // send off
            client.send(options.data);
        });

};
},{"promise":6}],14:[function(require,module,exports){
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


},{"element-kit":1}]},{},[12])(12)
});