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
             * @param {HTMLElement} options.el - The input element checkbox
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
                this.el = this.options.el;

                if (!Utils.hasClass(this.el, 'ui-checkbox')) {
                    console.error('checkbox cannot be created: no ui-checkbox class!');
                } else {
                    this.setup();
                }

            },

            /**
             * Sets up html.
             */
            setup: function () {
                var isCheckedOnInit = this.getFormElement().checked;
                this._container = this._buildUIElement(this.el);
                // if input element is already checked initially, check it!
                if (isCheckedOnInit) {
                    this.check();
                    this.isCheckedOnInit = isCheckedOnInit;
                }

            },

            /**
             * Builds the checkbox UI-friendly version.
             * @param {HTMLElement} inputEl - The input element
             * @private
             */
            _buildUIElement: function (inputEl) {
                return Utils.wrapHtmlElement(inputEl, '<div class="ui-checkbox-container"></div>');
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
                input.setAttribute('checked', 'checked');
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
                input.removeAttribute('checked');
                Utils.removeClass(container, this.checkedClass);
                if (this.options.onUnchecked) {
                    this.options.onUnchecked(input.value, input, container);
                }
            },

            /**
             * Gets the checkbox input element.
             * @returns {HTMLElement} Returns the checkbox input element
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
                container.parentNode.replaceChild(input, container);
                if (this.isCheckedOnInit) {
                    input.setAttribute('checked', 'checked');
                }
            }

        };

        return Checkbox;
    });