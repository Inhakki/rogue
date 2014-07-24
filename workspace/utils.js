define([
    'framework/framework',
    'framework/libs/core-modules/akqa-core/utils'
],
function (App, CoreUtils) {

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
                    re = className + '[\\s]*';
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
            return el.className.indexOf(className) !== -1;
        },

        /**
         * Creates an HTML Element from an html string.
         * @param {string} html - String of html
         * @returns {HTMLElement} - Returns and html element node
         */
        createHtmlElement: function (html) {
            var tempParentEl;
            if (html) {
                tempParentEl = document.createElement('div');
                tempParentEl.innerHTML = html;
                return tempParentEl.childNodes[1];
            }
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
                return el.querySelectorAll(className);
            }
        },

        /**
         * Adds an event listener to an element.
         * @param {HTMLElement} el - The element to listen to
         * @param {string} event - The event to listen to
         * @param {Function} callback - The function that fires when the event happens
         * @param {boolean} [useCapture] - Whether to use capture (see Web.API.EventTarget.addEventListener)
         */
        addEventListener: function (el, event, callback, useCapture) {

            var listener = _.bind(function (e) {
                // force the 'this' to be the value of the el, rather than the window object
                // to work like our more modern friend, addEventListener()
                callback(e);
            }, el);

            if (!this.isIE8()) {
                el.addEventListener(event, listener, useCapture);
            } else {
                el.attachEvent('on' + event, listener);
            }

            // cache click function to use as unique identifier
            // to remove event listener later
            this.events = this.events || {};
            this.events[callback] = listener;
        },

        /**
         * Removes an event listener from an element.
         * @param {HTMLElement} el - The element with the event
         * @param {string} event - The event to remove
         * @param {Function} listener - The event listener function to be removed
         * @param {boolean} useCapture - Whether to use capture (see Web.API.EventTarget.addEventListener)
         */
        removeEventListener: function (el, event, listener, useCapture) {
            listener = this.events[listener];
            if (!this.isIE8()) {
                el.removeEventListener(event, listener, useCapture);
            } else {
                el.detachEvent(event, listener);
            }
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
         */
        isIE8: function () {
            var rv = -1;
            var ua = navigator.userAgent;
            var re = new RegExp("Trident\/([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
            return (rv == 4);
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
