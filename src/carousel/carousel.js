define(['underscore', 'element-kit'], function (_) {
    "use strict";

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
         * Loads an asset at a given index.
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

    return Carousel;

});