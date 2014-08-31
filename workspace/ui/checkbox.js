define([
    'framework/framework',
    'framework/utils',
    'framework/form/base-form-element'
],
    function (App, Utils, BaseFormElement) {
        "use strict";

        var Checkbox = function (options) {
            this.initialize(options);
        };

        Checkbox.prototype = Utils.extend({}, BaseFormElement.prototype, {

            /**
             * Initialization.
             * @param {object} options - Options to pass
             * @param {HTMLInputElement} options.el - The input element checkbox
             * @param {Function} [options.onChecked] - A callback function that fires when the checkbox is checked
             * @param {Function} [options.onUnchecked] - A callback function that fires when the checkbox is un-checked
             * @param {string} [options.cssPrefix] - A custom css class that will be used as namespace for all css classes applied
             */
            initialize: function (options) {

                this.options = Utils.extend({
                    el: null,
                    onChecked: null,
                    onUnchecked: null,
                    cssPrefix: 'ui-checkbox'
                }, options);

                this.checkedClass = this.options.cssPrefix + '-checked';
                this.disabledClass = this.options.cssPrefix + '-disabled';
                this.el = this.options.el;

                if (!this.el.tagName.toLowerCase() !== 'input') {
                    console.warn('checkbox error: no input element was passed');
                }

                BaseFormElement.prototype.initialize.call(this, options);

                this.setup();

            },

            /**
             * Sets up html.
             */
            setup: function () {
                var input = this.getFormElement();

                Utils.addClass(input, this.options.cssPrefix + '-input');

                this._container = this._buildUIElement(this.el);

                // if input element is already checked initially, check it!
                this.isInitChecked = input.checked;
                if (this.isInitChecked) {
                    Utils.addClass(this._container, this.checkedClass);
                }

                this.isInitDisabled = input.disabled;
                if (this.isInitDisabled) {
                    Utils.addClass(this._container, this.disabledClass);
                }

                // setup events
                Utils.addEventListener(this.getUIElement(), 'click', this._onClick.bind(this));
            },

            /**
             * When the checkbox element is clicked.
             * @private
             */
            _onClick: function () {
                var input = this.getFormElement();
                if (!input.disabled) {
                    if (!Utils.hasClass(this.getUIElement(), this.checkedClass)) {
                        this.check();
                    } else {
                        this.uncheck();
                    }
                }
            },

            /**
             * Builds the checkbox UI-friendly version.
             * @param {HTMLInputElement} inputEl - The input element
             * @returns {HTMLElement} Returns the input element wrapped in a new container
             * @private
             */
            _buildUIElement: function (inputEl) {
                return Utils.wrapHtmlElement(inputEl, '<div class="' + this.options.cssPrefix + '"></div>');
            },


            /**
             * Checks the checkbox.
             */
            check: function () {
                var input = this.getFormElement(),
                    container = this.getUIElement();
                if (!input.checked) {
                    input.checked = true;
                }
                Utils.addClass(container, this.checkedClass);
                if (this.options.onChecked) {
                    this.options.onChecked(input.value, input, container);
                }
            },

            /**
             * Un-checks the checkbox.
             */
            uncheck: function () {
                var input = this.getFormElement(),
                    container = this.getUIElement();
                if (input.checked) {
                    input.checked = false;
                }
                Utils.removeClass(container, this.checkedClass);
                if (this.options.onUnchecked) {
                    this.options.onUnchecked(input.value, input, container);
                }
            },

            /**
             * Enables the checkbox.
             */
            enable: function () {
                this.getFormElement().disabled = false;
                Utils.removeClass(this.getUIElement(), this.disabledClass);
            },

            /**
             * Disables the checkbox.
             */
            disable: function () {
                this.getFormElement().disabled = true;
                Utils.addClass(this.getUIElement(), this.disabledClass);
            },

            /**
             * Gets the checkbox input element.
             * @returns {HTMLInputElement} Returns the checkbox input element
             */
            getFormElement: function () {
                return this.el;
            },

            /**
             * Gets the checkbox div element.
             * @returns {HTMLElement} Returns the checkbox div element.
             */
            getUIElement: function () {
                return this._container;
            },

            /**
             * Destruction of this class.
             */
            destroy: function () {
                var container = this.getUIElement(),
                    input = this.getFormElement();

                // remove event listener
                Utils.removeEventListener(this.getUIElement(), 'click', this._onClick.bind(this));

                // remove stray html
                container.parentNode.replaceChild(input, container);

                if (this.isInitChecked) {
                    input.checked = true;
                }
                if (this.isInitDisabled) {
                    input.disabled = true;
                }
                BaseFormElement.prototype.destroy.call(this);
            }

        });

        return Checkbox;
    });