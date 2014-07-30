define([
    'framework/framework',
    'framework/utils'
],
    function (App, Utils) {
        "use strict";

        var Checkbox = function (options) {
            this.initialize(options);
        };

        Checkbox.prototype = {

            /**
             * Initialization.
             * @param {object} options - Options to pass
             * @param {HTMLInputElement} options.el - The input element checkbox
             * @param {Function} options.onChecked - A callback function that fires when the checkbox is checked
             * @param {Function} options.onUnchecked - A callback function that fires when the checkbox is un-checked
             */
            initialize: function (options) {

                this.options = Utils.extend({
                    el: null,
                    onChecked: null,
                    onUnchecked: null
                }, options);

                this.checkedClass = 'ui-checkbox-checked';
                this.disabledClass = 'ui-checkbox-disabled';
                this.el = this.options.el;

                if (!Utils.hasClass(this.el, 'ui-checkbox-input')) {
                    console.error('checkbox cannot be created: input element has no ui-checkbox-input class!');
                } else {
                    this.setup();
                }

            },

            /**
             * Sets up html.
             */
            setup: function () {
                var input = this.getFormElement();

                Utils.addClass(input, 'ui-checkbox-input');

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
                if (!this.isChecked()) {
                    this.check();
                } else {
                    this.uncheck();
                }
            },

            /**
             * Builds the checkbox UI-friendly version.
             * @param {HTMLInputElement} inputEl - The input element
             * @private
             */
            _buildUIElement: function (inputEl) {
                return Utils.wrapHtmlElement(inputEl, '<div class="ui-checkbox"></div>');
            },

            /**
             * Checks whether the checkbox is checked.
             */
            isChecked: function () {
                return Utils.hasClass(this.getUIElement(), this.checkedClass);
            },

            /**
             * Checks the checkbox.
             */
            check: function () {
                var input = this.getFormElement(),
                    container = this.getUIElement();
                if (!input.checked) {
                    input.setAttribute('checked', 'checked');
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
                    input.removeAttribute('checked');
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
                this.getFormElement().removeAttribute('disabled');
                Utils.removeClass(this.getUIElement(), this.disabledClass);
            },

            /**
             * Disables the checkbox.
             */
            disable: function () {
                this.getFormElement().setAttribute('disabled', 'disabled');
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
                    input.setAttribute('checked', 'checked');
                }
                if (this.isInitDisabled) {
                    input.setAttribute('disabled', 'disabled');
                }
            }

        };

        return Checkbox;
    });