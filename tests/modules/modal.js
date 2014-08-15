define([
    'framework/framework',
    'framework/utils'
], function (App, Utils) {
    'use strict';

    var Modal = function (options) {
        this.initialize(options);
    };

    Modal.prototype = {

        /**
         * Sets up the modal.
         * @param {object} options - The options
         * @param {HTMLElement} [options.el] - The element that should be used as the modal's container
         * @param {HTMLElement} [options.contentEl] - The element that contains the modal content which gets nested inside the modal container
         * @param {Function} [options.onHide] - A function that gets fired when the modal hides.
         * @param {Function} [options.onShow] - A function that gets fired when the modal shows.
         * @param {Function} [options.onClickOutside] - When tapping outside of the modal
         */
        initialize: function (options) {

            this.options = Utils.extend({
                el: Utils.getElementsByClassName('modal')[0],
                contentEl: null,
                onHide: null,
                onShow: null,
                onClickOutside: this.destroy.bind(this),
                activeClass: 'modal-active'
            }, options);

            this.el = this.options.el;

        },

        /**
         * Shows the modal.
         */
        show: function () {
            if (!this.el.contains(this.options.contentEl)) {
                this.el.appendChild(this.options.contentEl);
            }
            Utils.addClass(this.el, this.options.activeClass);
            Utils.addEventListener(document, 'click', this._onDocClick.bind(this));
            if (this.options.onShow) {
                this.options.onShow();
            }
        },

        /**
         * Hides the modal.
         */
        hide: function () {
            Utils.removeClass(this.el, this.options.activeClass);
            Utils.removeEventListener(document, 'click', this._onDocClick.bind(this));
            if (this.options.onHide) {
                this.options.onHide();
            }
        },

        /**
         * Whether the modal is showing.
         * @returns {boolean} Returns truthy if showing, falsy if not
         */
        isActive: function () {
            return Utils.hasClass(this.el, this.options.activeClass);
        },

        /**
         * When the document window is clicked.
         * @param {Event} e - The event
         * @private
         */
        _onDocClick: function (e) {
            var clickedItem = e.target,
                isClickOutside = !this.options.contentEl.contains(clickedItem);
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
            Utils.removeClass(this.el, this.options.activeClass);
            this.el.removeChild(this.options.contentEl);
        }

    };

    return Modal;
});
