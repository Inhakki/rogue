define([
    'framework/framework',
    'framework/utils'
],
    function (App, Utils) {
        "use strict";

        var InputField = function (options) {
            this.initialize(options);
        };

        InputField.prototype = {

            /**
             * Initializes the Input Field class.
             * @param {object} options - Options to pass
             * @param {HTMLInputElement} options.el - The input field element
             * @param {Function} [options.onChange] - A callback function that fires when the input value changes
             * @param {string} [options.cssPrefix] - A custom css class that will be used as namespace for all css classes applied
             */
            initialize: function (options) {

                this.options = Utils.extend({
                    el: null,
                    onChange: null,
                    cssPrefix: 'ui-input-text'
                }, options);

                this.prefix = this.options.cssPrefix;

                this.disabledClass = this.prefix + '-disabled';
                this.activeClass = this.prefix + '-active';
                this.inputClass = this.prefix + '-input';
                this.containerClass = this.prefix;
                this.placeholderClass = this.prefix + '-placeholder';

                this.setup();

            },

            /**
             * Sets up events for showing/hiding tooltip.
             */
            setup: function () {
                var input = this.options.el;

                // add internal class if doesnt already exist
                Utils.addClass(input, this.inputClass);

                this._container = this._buildUIElement(input);
                this._inputEl = Utils.getElementsByClassName(this.inputClass, this._container)[0];

                this.origInputValue = input.value;
                this.isInitDisabled = input.disabled;


                // handle disabled state
                if (this.isInitDisabled) {
                    Utils.addClass(this._container, this.disabledClass);
                }

                this._setupEvents();

                // setup placeholder text
                if (!this.origInputValue) {
                    this.showPlaceholder();
                }
            },

            /**
             * Sets up events.
             * @private
             */
            _setupEvents: function () {
                var input = this.getFormElement(),
                    eventMap = this._getEventMap();

                for (var i = 0; i < eventMap.length; i++) {
                    var item = eventMap[i];
                    Utils.addEventListener(item.el, item.event, item.callback);
                }
            },

            /**
             * Gets a mapping of all events tied to the input field.
             * @returns {Array}
             * @private
             */
            _getEventMap: function () {
                var input = this.getFormElement();
                return [
                    {event: 'focus', el: input, callback: this._onInputFocus.bind(this)},
                    {event: 'blur', el: input, callback: this._onInputBlur.bind(this)},
                    {event: 'change', el: input, callback: this._onInputValueChange.bind(this)}
                ]
            },

            /**
             * Checks whether placeholder attribute are supported by the browser.
             * @returns {boolean} Returns true if browser supports it
             */
            isPlaceholderSupported: function () {
                var version = Utils.getIEVersion();
                return !version || (version !== 8 && version !== 9);
            },

            /**
             * Shows placeholder text.
             */
            showPlaceholder: function () {
                if (!this.isPlaceholderSupported()) {
                    this.getFormElement().value = this.getPlaceholder();
                    Utils.addClass(this.getUIElement(), this.placeholderClass);
                }
            },

            /**
             * Sets the value of the input field.
             * @param {string} value - The new input field value
             */
            setValue: function (value) {
                var input = this.getFormElement(),
                    currentVal = input.value;
                if (value !== currentVal && value !== this.getPlaceholder()) {
                    this.getFormElement().value = value;
                    this._triggerChange();
                }
            },

            /**
             * Gets the current input field value.
             * @returns {string} Returns current value
             */
            getValue: function () {
                return this.getFormElement().value;
            },

            /**
             * Clears placeholder text.
             */
            clearPlaceholder: function () {
                if (!this.isPlaceholderSupported()) {
                    this.getFormElement().value = '';
                    Utils.removeClass(this.getUIElement(), this.placeholderClass);
                }
            },

            /**
             * Builds the UI-friendly version of input field by wrapping it inside of a container.
             * @param {HTMLInputElement} inputEl - The input element
             * @returns {HTMLElement} Returns the input element wrapped in its container
             * @private
             */
            _buildUIElement: function (inputEl) {
                return Utils.wrapHtmlElement(inputEl, '<div class="' + this.containerClass + '"></div>');
            },

            /**
             * Gets the current placeholder text.
             * @returns {string}
             */
            getPlaceholder: function () {
                return this.getFormElement().getAttribute('placeholder');
            },

            /**
             * When the input gains focus.
             * @private
             */
            _onInputFocus: function () {
                if (this.getValue() === this.getPlaceholder()) {
                    this.clearPlaceholder();
                }
                Utils.addClass(this.getUIElement(), this.activeClass);
            },

            /**
             * When the input loses focus.
             * @private
             */
            _onInputBlur: function () {
                if (!this.getValue()) {
                    this.showPlaceholder();
                }
                Utils.removeClass(this.getUIElement(), this.activeClass);
            },

            /**
             * Triggers a value change.
             * @private
             */
            _triggerChange: function () {
                if (this.options.onChange) {
                    this.options.onChange(this.getValue(), this.getFormElement(), this.getUIElement());
                }
            },

            /**
             * When the input value changes.
             * @private
             */
            _onInputValueChange: function () {
                this._triggerChange();
            },

            /**
             * Gets the input field element.
             * @returns {HTMLInputElement} Returns the input field element
             */
            getFormElement: function () {
                return this._inputEl;
            },

            /**
             * Gets the input field div element.
             * @returns {HTMLElement} Returns the checkbox div element.
             */
            getUIElement: function () {
                return this._container;
            },

            /**
             * Enables the button toggle.
             */
            enable: function () {
                this.getFormElement().removeAttribute('disabled');
                Utils.removeClass(this.getUIElement(), this.disabledClass);
            },

            /**
             * Disables the button toggle.
             */
            disable: function () {
                this.getFormElement().setAttribute('disabled', 'true');
                Utils.addClass(this.getUIElement(), this.disabledClass);
            },

            /**
             * Destruction of this class.
             */
            destroy: function () {
                var container = this.getUIElement(),
                    input = this.getFormElement(),
                    eventMap = this._getEventMap();

                for (var i = 0; i < eventMap.length; i++) {
                    var item = eventMap[i];
                    Utils.removeEventListener(item.el, item.event, item.callback);
                }

                container.parentNode.replaceChild(input, container);

                if (this.isInitDisabled) {
                    input.setAttribute('disabled', 'true');
                }
                // set original value back
                this.setValue(this.origInputValue);
            }

        };

        return InputField;
    });