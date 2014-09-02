define([
    'framework/framework',
    'framework/libs/core-modules/akqa-core/utils'
],
function (App, CoreUtils) {
    "use strict";

    var Utils = function () {
        this.initialize();
    };

    Utils.prototype = {

        /**
         * Initialize.
         */
        initialize: function () {
            this._setupBindPolyfill();
        },

        /**
         * Adds a CSS class to an element.
         * @param {HTMLElement} el - The element to add a class to.
         * @param {string} className - The css class value to add
         */
        addClass: function  (el, className) {
            if (!this.hasClass(el, className)) {
                var existingNames = el.className;
                if (existingNames) {
                    el.className = existingNames + ' ';
                }
                el.className = el.className + className;
            }
        },

        /**
         * Remvoes a CSS class from an element.
         * @param {HTMLElement} el - The element to remove class from.
         * @param {string} className - The css class value to remove
         */
        removeClass: function (el, className) {
            var re;
            if (this.hasClass(el, className)) {

                if (el.className === className) {
                    // if the only class that exists,  remove to 
                     el.className = '';
                } else {
                    re = '[\\s]*' + className;
                    re = new RegExp(re, 'i');
                    el.className = el.className.replace(re, '');
                }
            }
        },

        /**
         * Checks if an element has a class.
         * @param {HTMLElement} el - The element to check.
         * @param {string} className - The css class value to check
         */
        hasClass: function (el, className) {
            var classes = el.className.split(' ');
            return classes.indexOf(className) !== -1;
        },

        /**
         * Creates an HTML Element from an html string.
         * @param {string} html - String of html
         * @returns {HTMLElement} - Returns and html element node
         */
        createHtmlElement: function (html) {
            var tempParentEl,
                el;
            if (html) {
                html = this.trim(html);
                tempParentEl = document.createElement('div');
                tempParentEl.innerHTML = html;
                el = tempParentEl.childNodes[0];
                return tempParentEl.removeChild(el);
            }
        },

        /**
         * Wrap a container element around another element.
         * @param {HTMLElement} el - The element to be wrapped
         * @param {string} html - The wrapper element
         */
        wrapHtmlElement: function (el, html) {
            var origContainer = el.parentNode,
                container = this.createHtmlElement(html);
            origContainer.replaceChild(container, el);
            container.appendChild(el);
            return container;
        },

        /**
         * Zaps whitespace from both ends of a string.
         * @param {string} val - The string value to trim
         * @returns {string} Returns a trimmed string
         */
        trim: function (val) {
            if (!String.prototype.trim) {
                String.prototype.trim = function () {
                    return val.replace(/^\s+|\s+$/g, '');
                };
            } else {
                val = val.trim();
            }
            return val;
        },

        /**
         * Gets a simplified mapping of all attributes of an element.
         * @param {HTMLElement} el - The element containing attributes
         * @returns {object} - Returns an object containing all attribute mappings
         */
        getElementAttrMap: function (el) {
            var attrs = el.attributes,
                map = {};
            if (attrs.length) {
                for (var i = 0; i < attrs.length; i++) {
                    map[attrs[i].name] = attrs[i].value;
                }
            }
            return map;
        },

        /**
         * Gets a deeply nested property of an object.
         * @param {object} obj - The object to evaluate
         * @param {string} map - A string denoting where the property that should be extracted exists
         * @param {object} fallback - The fallback if the property does not exist
         */
        getNested: function (obj, map, fallback) {
            return CoreUtils.getNested.apply(this, arguments);
        },

        /**
         * Gets element by its class name.
         * @param {string} className - The class name
         * @param {HTMLElement} [rootEl] - The root el used for scoping (optional)
         * @returns {NodeList|HTMLCollection} - Returns a node list if < IE9 and HTML Collection otherwise.
         * TODO: does NOT support CSS2 selectors in IE8, update asap
         */
        getElementsByClassName: function (className, rootEl) {
            var el = rootEl || document;
            if (!this.isIE8()) {
                return el.getElementsByClassName(className);
            } else {
                return el.querySelectorAll('.' + className);
            }
        },

        /**
         * Gets the closest ancestor element that has a class.
         * @param {string} className - The class name that the ancestor must have to match
         * @param {HTMLElement} el - The source element
         */
        getClosestAncestorElementByClassName: function (className, el) {
            var result,
                parentNode = el.parentNode;
            // we must check if the node has classname property because some don't (#document element)
            while (parentNode && typeof parentNode.className === 'string') {
                if (this.hasClass(parentNode, className)) {
                    result = parentNode;
                    break;
                } else {
                    parentNode = parentNode.parentNode;
                }
            }
            return result;
        },

        /**
         * Adds an event listener to an element.
         * @param {HTMLElement} el - The element to listen to
         * @param {string} event - The event to listen to
         * @param {Function} callback - The function that fires when the event happens
         * @param {boolean} [useCapture] - Whether to use capture (see Web.API.EventTarget.addEventListener)
         */
        addEventListener: function (el, event, callback, useCapture) {

            var listener = function (e) {
                callback(e);
            };

            if (this.getIEVersion() === 8) {
                // IE 8!
                // force the 'this' to be the value of the el, rather than the window object
                // to work like our more modern friend, addEventListener()
                el.attachEvent('on' + event, listener.bind(this));
            } else {
                el.addEventListener(event, listener, useCapture);
            }

            // cache click function to use as unique identifier
            // to remove event listener later
            this.events = this.events || {};
            this.events['e' + el + event + callback] = listener;
        },

        /**
         * Checks if an event listener has been bounded to an element.
         * @param {HTMLElement} el - The element to check
         * @param {string} event - The event to check
         * @param {Function} callback - The bounded function
         * @returns {boolean} Returns true if element has listener
         */
        hasEventListener: function (el, event, callback) {
            return this.events['e' + el + event + callback] ? true : false;
        },

        /**
         * Removes an event listener from an element.
         * @param {HTMLElement} el - The element with the event
         * @param {string} event - The event to remove
         * @param {Function} callback - The event listener function to be removed
         * @param {boolean} useCapture - Whether to use capture (see Web.API.EventTarget.addEventListener)
         */
        removeEventListener: function (el, event, callback, useCapture) {
            var eventKey = 'e' + el + event + callback,
                listener = this.events[eventKey];

            if (this.isIE8()) {
                // IE 8!
                el.detachEvent(event, listener);
            } else {
                el.removeEventListener(event, listener, useCapture);
            }

            this.events[eventKey] = null;
        },

        /**
         * Merges the contents of two or more objects.
         * @param {object} obj - The target object
         * @param {...object} - Additional objects who's properties will be merged in
         */
        extend: function (target) {
            return CoreUtils.extend.apply(this, arguments);
        },

        /**
         * Checks if browser is IE 8.
         * @returns {boolean} Returns true if the current browser is IE 8.
         * @deprecated
         */
        isIE8: function () {
            return this.getIEVersion() === 8;
        },

        /**
         * Gets the current IE version.
         * @returns {Number} Returns the IE version number
         */
        getIEVersion: function () {
            if (navigator.appName == 'Microsoft Internet Explorer') {
                //Create a user agent var
                var ua = navigator.userAgent;
                //Write a new regEx to find the version number
                var re = new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})');
                //If the regEx through the userAgent is not null
                if (re.exec(ua) != null) {
                    //Set the IE version
                    return parseInt(RegExp.$1);
                }
            } else {
                return false;
            }
        },

        /**
         * Sets up the fallback polyfill for binding 'this' to functions.
         * @private
         */
        _setupBindPolyfill: function () {
            if (!Function.prototype.bind) {
                Function.prototype.bind = function (oThis) {
                    if (typeof this !== 'function') {
                        // closest thing possible to the ECMAScript 5
                        // internal IsCallable function
                        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                    }

                    var aArgs = Array.prototype.slice.call(arguments, 1),
                        fToBind = this,
                        fNOP = function () {},
                        fBound = function () {
                            return fToBind.apply(this instanceof fNOP && oThis
                                ? this
                                : oThis,
                                aArgs.concat(Array.prototype.slice.call(arguments)));
                        };

                    fNOP.prototype = this.prototype;
                    fBound.prototype = new fNOP();

                    return fBound;
                };
            }
        }
    };

    return new Utils();

});
