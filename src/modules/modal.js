define(function (require) {
    'use strict';

    var ElementUtils = require('element-utils');

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
         * @param {string} [options.activeClass] - The class that gets added to the modal container when the modal is showing
         */
        initialize: function (options) {

            this.options = ElementUtils.extend({
                containerEl: document.getElementsByTagName('body')[0],
                el: null,
                onHide: null,
                onShow: null,
                onClickOutside: this.hide.bind(this),
                activeClass: 'modal-active'
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
            ElementUtils.addClass(this.container, this.options.activeClass);
            ElementUtils.addEventListener(document, 'click', this._onDocClick.bind(this), true);
            if (this.options.onShow) {
                this.options.onShow();
            }
        },

        /**
         * Hides the modal.
         */
        hide: function () {
            ElementUtils.removeClass(this.container, this.options.activeClass);
            ElementUtils.removeEventListener(document, 'click', this._onDocClick.bind(this), true);
            if (this.options.onHide) {
                this.options.onHide();
            }
        },

        /**
         * Whether the modal is showing.
         * @returns {boolean} Returns truthy if showing, falsy if not
         */
        isActive: function () {
            return ElementUtils.hasClass(this.container, this.options.activeClass);
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
            ElementUtils.removeClass(this.container, this.options.activeClass);
            if (this.container.contains(this.content)) {
                this.container.removeChild(this.content);
            }
            ElementUtils.removeEventListener(document, 'click', this._onDocClick.bind(this), true);
        }

    };

    return Modal;
});
