define([
    'framework/framework',
    'framework/utils'
],
    function (App, Utils) {
        "use strict";

        var ButtonToggleElement = function (options) {
            this.initialize(options);
        };

        ButtonToggleElement.prototype = {

            /**
             * Initialization.
             * @param {object} options - Options to pass
             * @param {HTMLInputElement} options.el - The input element checkbox
             * @param {Function} [options.onSelect] - A callback function that fires when the button toggle element is selected
             * @param {Function} [options.onDeselect] - A callback function that fires when the button toggle element is deselected
             * @param {string} [options.cssPrefix] - A custom css class that will be used as namespace for all css classes applied
             */
            initialize: function (options) {

                this.options = Utils.extend({
                    el: null,
                    onSelect: null,
                    onDeselect: null,
                    cssPrefix: 'ui-button-toggle'
                }, options);

                // cache vars
                this.selectedClass = this.options.cssPrefix + '-selected';
                this.disabledClass = this.options.cssPrefix + '-disabled';
                this._input = this.options.el;

                if (this._input.tagName.toLowerCase() !== 'input') {
                    console.error('button toggle element cannot be created: constructor must be passed an input element!');
                } else {
                    this.setup();
                }

            },

            /**
             * Sets up html.
             */
            setup: function () {
                var input = this.getFormElement();

                this.isInitChecked = input.checked;
                this.isInitDisabled = input.disabled;

                Utils.addClass(input, this.options.cssPrefix + '-input');
                this._container = this._buildUIElement(input);

                if (this.isInitChecked) {
                    Utils.addClass(this._container, this.selectedClass);
                }
                if (this.isInitDisabled) {
                    Utils.addClass(this._container, this.disabledClass);
                }

                this._setupEvents();
            },

            /**
             * Sets up events.
             * @private
             */
            _setupEvents: function () {
                Utils.addEventListener(this.getUIElement(), 'click', this._onToggleClick.bind(this))
            },

            /**
             * When the input item is clicked.
             * @private
             */
            _onToggleClick: function () {
                var input = this.getFormElement();
                if (input.checked) {
                    this.select();
                } else if (!this.isRadio()) {
                    this.deselect();
                }
            },

            /**
             * Builds the UI-friendly version of the toggle input by wrapping it in a container.
             * @param {HTMLInputElement} inputEl - The input element
             * @private
             */
            _buildUIElement: function (inputEl) {
                return Utils.wrapHtmlElement(inputEl, '<div class="' + this.options.cssPrefix + '"></div>');
            },

            /**
             * Checks whether input is a radio button.
             * @param {HTMLInputElement} el - The input to check
             * @returns {boolean}
             */
            isRadio: function (el) {
                return this.getFormElement().getAttribute('type') === 'radio';
            },

            /**
             * Selects the toggle item.
             */
            select: function () {
                var input = this.getFormElement(),
                    toggle = this.getUIElement();
                Utils.addClass(toggle, this.selectedClass);
                if (this.options.onSelected) {
                    this.options.onSelected(input.value, input, toggle);
                }

            },

            /**
             * De-selects the toggle item.
             */
            deselect: function () {
                var input = this.getFormElement(),
                    toggle = this.getUIElement();
                Utils.removeClass(toggle, this.selectedClass);
                if (this.options.onDeselected) {
                    this.options.onDeselected(input.value, input, toggle);
                }
            },

            /**
             * Gets the checkbox input element.
             * @returns {HTMLInputElement} Returns the checkbox input element
             */
            getFormElement: function () {
                return this._input;
            },

            /**
             * Gets the checkbox div element.
             * @returns {HTMLElement} Returns the checkbox div element.
             */
            getUIElement: function () {
                return this._container;
            },

            /**
             * Enables the button toggle.
             */
            enable: function () {
                this.getFormElement().disabled = false;
                Utils.removeClass(this.getUIElement(), this.disabledClass);
            },

            /**
             * Disables the button toggle.
             */
            disable: function () {
                this.getFormElement().disabled = true;
                Utils.addClass(this.getUIElement(), this.disabledClass);
            },

            /**
             * Destruction of this class.
             */
            destroy: function () {
                var container = this.getUIElement(),
                    input = this.getFormElement();

                container.parentNode.replaceChild(input, container);

                if (this.isInitChecked) {
                    input.checked = true;
                }

                if (this.isInitDisabled) {
                    input.disabled = true;
                }

                Utils.removeEventListener(this.getUIElement(), 'click', this._onToggleClick.bind(this))
            }

        };

        return ButtonToggleElement;
    });