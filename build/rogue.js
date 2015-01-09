/** 
* Rogue - v2.2.1.
* git://github.com/mkay581/rogue.git
* Copyright 2015. Licensed MIT.
*/
(function (factory) {
    'use strict';
    // support both AMD and non-AMD
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'element-kit'], function (_) {
            return factory(_);
        });
    } else {
        factory(window._);
    }
})((function (_) {
    'use strict';

    var Tooltip = function (options) {
        this.initialize(options);
    };

    Tooltip.prototype = {

        /**
         * Initializes the Tooltip.
         * @param {object} options - Options to pass
         * @param {HTMLElement} options.el - The container of the tooltip
         * @param {string} [options.showEvent] - A string indicating which event should trigger showing the tooltip
         * @param {string} [options.hideEvent] - A string indicating which event should trigger hiding the tooltip
         * @param {Function} [options.onShow] - A callback function that fires when tooltip panel is shown
         * @param {Function} [options.onHide] - A callback function that fires when tooltip panel is hidden
         * @param {string} [options.cssPrefix] - A custom css class that will be used as namespace for all css classes applied
         */
        initialize: function (options) {

            this.options = _.extend({
                el: null,
                showEvent: null,
                hideEvent: null,
                onShow: null,
                onHide: null,
                cssPrefix: 'ui-tooltip'
            }, options);

            this.prefix = this.options.cssPrefix;
            this.activeClass = this.prefix + '-active';

            this.el = this.options.el;
            this.trigger = this.el.getElementsByClassName(this.prefix + '-trigger')[0];

            this.setup();

        },

        /**
         * Sets up events for showing/hiding tooltip.
         */
        setup: function () {
            var options = this.options;

            // setup events if needed
            if (options.showEvent) {
                this.eventMap = this._setupEvents(options.showEvent, options.hideEvent);
            }
        },

        /**
         * Sets up events.
         * @param {string} showEvent - The event string to hide tooltip
         * @param {string} hideEvent - The event string to show tooltip
         * @returns {object} - Returns a mapping of all events to their trigger functions.
         * @private
         */
        _setupEvents: function (showEvent, hideEvent) {
            var map = this._buildEventMap(showEvent, hideEvent),
                key,
                e;
            for (key in map) {
                if (map.hasOwnProperty(key)) {
                    e = map[key];
                    this.trigger.addEventListener(e.name, e.event);
                }
            }
            return map;
        },

        /**
         * Fires when the show and hide events are the same and we need to determine whether to show or hide.
         * @private
         */
        _onDuplicateEvent: function () {
            if (this.isActive()) {
                this.hide();
            } else {
                this.show();
            }
        },


        /**
         * Builds the event map.
         * @param {string} showEvent - The event string to hide tooltip
         * @param {string} hideEvent - The event string to show tooltip
         * @returns {object} - Returns a mapping of all events to their trigger functions.
         * @private
         */
        _buildEventMap: function (showEvent, hideEvent) {
            var map = {};

            if (showEvent === hideEvent) {
                // show event and hide events are the same
                map['showEvent'] = {
                    name: showEvent,
                    event: this._onDuplicateEvent.bind(this)
                };
                return map;
            }

            if (showEvent) {
                map['showEvent'] = {
                    name: showEvent,
                    event: this.show.bind(this)
                }
            }
            if (hideEvent) {
                map['hideEvent'] = {
                    name: hideEvent,
                    event: this.hide.bind(this)
                }
            }
            return map;
        },

        /**
         * Shows the tooltip.
         */
        show: function () {
            this.el.kit.classList.add(this.activeClass);
            if (this.options.onShow) {
                this.options.onShow();
            }
        },

        /**
         * Hides the tooltip.
         */
        hide: function () {
            this.el.kit.classList.remove(this.activeClass);
            if (this.options.onHide) {
                this.options.onHide();
            }
        },

        /**
         * Checks whether tooltip is showing.
         * @returns {boolean} Returns true if showing
         */
        isActive: function () {
            return this.el.kit.classList.contains(this.activeClass);
        },

        /**
         * Destruction of this class.
         */
        destroy: function () {
            var eventMap = this.eventMap,
                key,
                e;

            // destroy events
            if (eventMap) {
                for (key in eventMap) {
                    if (eventMap.hasOwnProperty(key)) {
                        e = eventMap[key];
                        this.trigger.removeEventListener(e.name, e.event);
                    }
                }
            }
        }

    };

    var Modal = function (options) {
        this.initialize(options);
    };

    Modal.prototype = {

        /**
         * Sets up the modal.
         * @param {object} options - The options
         * @param {HTMLElement} options.containerEl - The element that should be used as the modal's container
         * @param {HTMLElement} options.el - The element that contains the modal content which gets nested inside the modal container
         * @param {Function} [options.onHide] - A function that gets fired when the modal hides.
         * @param {Function} [options.onShow] - A function that gets fired when the modal shows.
         * @param {Function} [options.onClickOutside] - When tapping outside of the modal
         * @param {string} [options.activeClass] - The CSS class that gets added to each modal when shown
         * @param {string} [options.containerActiveClass] - The CSS class that gets added to the modal container when there is at least one modal showing
         */
        initialize: function (options) {

            this.options = _.extend({
                containerEl: document.getElementsByTagName('body')[0],
                el: null,
                onHide: null,
                onShow: null,
                onClickOutside: this.hide.bind(this),
                activeClass: 'modal-active',
                containerActiveClass: 'modal-container-active'
            }, options);

            this.container = this.options.containerEl;
            this.content = this.options.el;
        },

        /**
         * Sets stuff up.
         */
        setup: function () {
            if (!this.container.contains(this.content)) {
                this.container.appendChild(this.content);
            }
        },

        /**
         * Shows the modal.
         */
        show: function () {
            this.setup();
            this.content.kit.classList.add(this.options.activeClass);
            document.addEventListener('click', this._onDocClick.bind(this), true);
            this.container.kit.classList.add(this.options.containerActiveClass);
            if (this.options.onShow) {
                this.options.onShow();
            }
        },

        /**
         * Hides the modal.
         */
        hide: function () {
            this.content.kit.classList.remove(this.options.activeClass);
            document.removeEventListener('click', this._onDocClick.bind(this), true);

            // do not remove container's active class if other active modals exist
            if (!this.container.getElementsByClassName(this.options.activeClass).length) {
                this.container.kit.classList.remove(this.options.containerActiveClass);
            }

            if (this.options.onHide) {
                this.options.onHide();
            }
        },

        /**
         * Whether the modal is showing.
         * @returns {boolean} Returns truthy if showing, falsy if not
         */
        isActive: function () {
            return this.content.classList.contains(this.options.activeClass);
        },

        /**
         * When the document window is clicked.
         * @param {Event} e - The event
         * @private
         */
        _onDocClick: function (e) {
            var clickedItem = e.target,
                isClickOutside = !this.content.contains(clickedItem);
            if (isClickOutside && this.isActive()) {
                if (this.options.onClickOutside) {
                    this.options.onClickOutside();
                }
            }
        },

        /**
         * Destroys the modal.
         */
        destroy: function () {
            this.content.kit.classList.remove(this.options.activeClass);
            if (this.container.contains(this.content)) {
                this.container.removeChild(this.content);
            }
            if (!this.container.getElementsByClassName(this.options.activeClass).length) {
                this.container.kit.classList.remove(this.options.containerActiveClass);
            }
            document.removeEventListener('click', this._onDocClick.bind(this), true);
        }

    };

    /**
     * A Caching utility that uses localStorage and sessionStorage.
     * @description Allows storing and removing data that persists beyond a page refresh and isn’t transmitted to the server.
     */

    var CacheManager = {

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

    /**
     * Adds carousel functionality to a set up pre-determined HTML markup.
     * @class Carousel
     */
    var Carousel = function (options) {
        this.initialize(options);
    };

    /**
     * A callback function that fires after a new active panel is set
     * @callback Carousel~onPanelChange
     * @param {Number} index - The index of the new panel
     */

    Carousel.prototype = {

        /**
         * When the carousel is instantiated.
         * @param {object} options - Options passed into instance
         * @param {HTMLCollection} options.panels - The panels in which to use for the carousel (an array of photos)
         * @param {string} [options.assetClass] - The CSS class of the asset images inside of the DOM
         * @param {string} [options.assetLoadingClass] - The CSS class that gets added to an asset when it is loading
         * @param {boolean} [options.autoLoadAssets] - Whether or not to automatically load assets when active
         * @param {string} [options.panelActiveClass] - The CSS class that gets added to an panel when it becomes active
         * @param {Carousel~onPanelChange} [options.onPanelChange] - When the current panel is changed
         * @param {string} [options.lazyLoadAttr] - The attribute containing the url path to content that is to be lazy loaded
         */
        initialize: function (options) {

            this.options = _.extend({
                panels: [],
                assetClass: null,
                assetLoadingClass: 'carousel-asset-loading',
                autoLoadAssets: true,
                panelActiveClass: 'carousel-panel-active',
                onPanelChange: null,
                lazyLoadAttr: 'data-src'
            }, options);

            // cache vars
            this._checkForInitErrors();
            this.goToPanel(0);

        },

        /**
         * Checks for errors upon initialize.
         * @private
         */
        _checkForInitErrors: function () {
            if (!this.options.panels.length) {
                // no assets
                console.error('carousel init error: no panels were passed in constructor');
            }
        },

        /**
         * Transitions the carousel to a panel of an index.
         * @param {Number} index - The index number to go to
         */
        goToPanel: function (index) {

            var panels = this.options.panels,
                maxIndex = panels.length - 1,
                minIndex = 0,
                prevIndex = this.getCurrentIndex();

            if (index > maxIndex) {
                // set to first index if too high
                index = minIndex;
            } else if (index < minIndex) {
                // set to last index if too low
                index = maxIndex;
            }

            if (prevIndex !== index) {

                if (prevIndex !== undefined) {
                    panels[prevIndex].kit.classList.remove(this.options.panelActiveClass);
                }
                this._currentIndex = index;

                panels[index].kit.classList.add(this.options.panelActiveClass);

                if (this.options.autoLoadAssets) {
                    this.loadPanelAssets(index);
                }

                if (this.options.onPanelChange && prevIndex !== undefined) {
                    this.options.onPanelChange(index)
                }
            }
        },

        /**
         * Gets the current index that is showing.
         * @returns {Number} Returns the index
         */
        getCurrentIndex: function () {
            return this._currentIndex;
        },

        /**
         * Loads assets for a given panel.
         * @param {Number} index - The index of the panel containing the assets to load
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
         * Destroys the carousel.
         */
        destroy: function () {
            this.options.panels[this.getCurrentIndex()].kit.classList.remove(this.options.panelActiveClass);
            this._currentIndex = null;
        }
    };


    return {
        CacheManager: CacheManager,
        Tooltip: Tooltip,
        Modal: Modal,
        Carousel: Carousel
    };

}));