define(function (require) {
    "use strict";

    var ElementUtils = require('./element-utils');

    /**
     * Adds neat little carousel functionality to a set up predetermined HTML markup.
     * @class Carousel
     * @param {HTMLElement} options.el - The element to use as the carousels container
     */
    var Carousel = function (options) {
        this.initialize(options);
    };

    Carousel.prototype = {

        /**
         * When the carousel is instantiated.
         * @param {object} options - Options passed into instance
         */
        initialize: function (options) {

            this.options = ElementUtils.extend({
                el: document.getElementsByTagName('body')[0]
            }, options);

            // cache vars
            this.panel = this.options.el.getElementsByClassName('carousel-panel')[0];
            this.panelItems = this.panel.getElementsByClassName('carousel-item');
            this.indicators = this.el.getElementsByClassName('carousel-indicator-item');

            this._currentIndex = 0;
        },

        /**
         * Transitions the carousel to the next panel.
         * @param {Number} index - The index number to go to
         */
        goTo: function (index) {

            var maxIndex = this.panelItems.length - 1,
                minIndex = 0,
                panelItemWidth = this.panelItems[0].clientWidth;

            if (index > maxIndex) {
                // navigate to first index if too high
                index = minIndex;
            } else if (index < minIndex) {
                // navigate to last index if too low
                index = maxIndex;
            }

            if (this.getCurrentIndex() !== index) {
                this.panel.style.left = -(index * panelItemWidth) + 'px';
                this._currentIndex = index;
                this._setIndicator(index);
            }
        },

        /**
         * Handles setting the indicator to sync with the currently showing carousel panel.
         * @param {Number} index - The index of which to activate indicator
         * @private
         */
        _setIndicator: function (index) {
            var activeClass ='carousel-indicator-item-active',
                activeIndicator = this.options.el.getElementsByClassName(activeClass)[0];
            ElementUtils.removeClass(activeIndicator, activeClass);
            ElementUtils.addClass(this.indicators[index], activeClass);
        },

        /**
         * Gets the current index that is showing.
         * @returns {Number} Returns the index
         */
        getCurrentIndex: function () {
            return this._currentIndex;
        }
    };

    return Carousel;

});