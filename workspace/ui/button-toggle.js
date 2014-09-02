define([
    'framework/framework',
    'framework/utils',
    'framework/form/base-form-element'
],
    function (App, Utils, BaseFormElement) {
        "use strict";

        var ButtonToggle = function (options) {
            this.initialize(options);
        };

        ButtonToggle.prototype = Utils.extend({}, BaseFormElement.prototype, {

            /**
             * Initialization.
             * @param {object} options - Options to pass
             * @param {Array} options.inputs - The collection of input elements to be made into toggle items
             * @param {Function} [options.onChange] - A callback function that fires when of the toggle elements are selected
             * @param {string} [options.cssPrefix] - A custom css class that will be used as namespace for all css classes applied
             * @param {Function} [options.onSelect] - A callback function that fires when the button toggle element is selected
             * @param {Function} [options.onDeselect] - A callback function that fires when the button toggle element is deselected
             */
            initialize: function (options) {

                this.options = Utils.extend({
                    inputs: [],
                    onChange: null,
                    cssPrefix: 'ui-button-toggle'
                }, options);

                BaseFormElement.prototype.initialize.call(this, options);

                this._container = this.options.container;

                if (!this.options.inputs.length && this._container) {
                    this.options.inputs = this._container.querySelectorAll('input');
                }

                // cache vars
                this.selectedClass = this.options.cssPrefix + '-selected';
                this.disabledClass = this.options.cssPrefix + '-disabled';
                this._input = this.options.el;

                if (!this.options.inputs.length) {
                    console.error('could not build toggle items: no toggle input items were passed');
                } else {
                    this._formElements = this._buildFormElements(this.options.inputs);
                    this._UIElements = this._buildUIElements(this._formElements);
                }

                this.setup();

            },

            /**
             * Sets up html.
             */
            setup: function () {
//                var input = this.getFormElement();
//                Utils.addClass(input, this.options.cssPrefix + '-input');
                this._setupEvents();
            },

            /**
             * Sets up events.
             * @private
             */
            _setupEvents: function () {
                this._triggerAll(function (formElement, UIElement) {
                    Utils.addEventListener(UIElement, 'click', this._onToggleClick.bind(this));
                }.bind(this));
            },

            /**
             * Gets all the current input toggles.
             * @returns {Array|*}
             */
            getFormElements: function () {
                return this._formElements;
            },

            /**
             * Gets all current ui-versions of input toggles.
             * @returns {Array|*}
             */
            getUIElements: function () {
                return this._UIElements;
            },

            /**
             * Private delegator that triggers a method on all passed toggle items.
             * @param {Function} callback - The function that should be executed for each input item
             * @private
             */
            _triggerAll: function (callback) {
                var i,
                    formElements = this.getFormElements(),
                    UIElements = this.getUIElements();
                for (i = 0; i < formElements.length; i++) {
                    callback(formElements[i], UIElements[i], i);
                }
            },

            /**
             * When the input item is clicked.
             * @param {Event} e - The event
             * @private
             */
            _onToggleClick: function (e) {
                var clickedItem = e.target,
                    clickedIndex = this.getFormElements().indexOf(clickedItem),
                    UIElement = this.getUIElement(clickedIndex);
                if (clickedItem.tagName.toLowerCase() === 'input') {

                    if (clickedItem.checked) {
                        this._onToggleSelect(clickedItem, UIElement);
                    } else {
                        this._onToggleDeselect(clickedItem, UIElement);
                    }

                    // only trigger change if clicked item is a radio button
                    // and is not the same as the last clicked item
                    if (!this.isRadio() || this._lastClickedItem !== clickedItem) {
                        this.triggerChange(clickedItem, UIElement);
                        this._lastClickedItem = clickedItem;
                    }
                }

            },

            /**
             * When a toggle is selected.
             * @param {HTMLInputElement} formElement - The input element
             * @param {HTMLElement} UIElement - The ui element
             * @private
             */
            _onToggleSelect: function (formElement, UIElement) {
                if (this.isRadio()) {
                    this._triggerAll(function (formElement, UIElement) {
                        Utils.removeClass(UIElement, this.selectedClass);
                    }.bind(this));
                }
                Utils.addClass(UIElement, this.selectedClass);
            },

            /**
             * When a toggle is deselected.
             * @param {HTMLInputElement} formElement - The input element
             * @param {HTMLElement} UIElement - The ui element
             * @private
             */
            _onToggleDeselect: function (formElement, UIElement) {
                Utils.removeClass(UIElement, this.selectedClass);
            },

            /**
             * Builds the form toggle elements.
             * @param {Array|HTMLCollection} elements - An array of button toggle elements
             * @returns {Array} Returns the array of element
             * @private
             */
            _buildFormElements: function (elements) {
                // convert to real array if HTMLCollection
                return Array.prototype.slice.call(elements);
            },

            /**
             * Builds the UI-friendly version of the toggle inputs and wraps them in their appropriate containers.
             * @param {Array} elements - The input elements
             * @returns {Array} Returns an array of the ui-versions of the elements
             * @private
             */
            _buildUIElements: function (elements) {
                var count = elements.length,
                    arr = [],
                    i,
                    formElement,
                    UIElement;
                for (i = 0; i < count; i++) {
                    formElement = elements[i];
                    UIElement = Utils.wrapHtmlElement(formElement, '<div class="' + this.options.cssPrefix + '"></div>');
                    // add selected class if selected initially
                    if (formElement.checked) {
                        Utils.addClass(UIElement, this.selectedClass);
                    }
                    if (formElement.disabled) {
                        Utils.addClass(UIElement, this.disabledClass);
                    }
                    arr.push(UIElement);
                }
                return arr;
            },

            /**
             * Checks whether input is a radio button.
             * @returns {boolean}
             */
            isRadio: function () {
                return this.getFormElements()[0].getAttribute('type') === 'radio';
            },

            /**
             * Triggers a change on the button toggle.
             * @param {HTMLInputElement} formElement - The input element
             * @param {HTMLElement} UIElement - The ui element
             */
            triggerChange: function (formElement, UIElement) {
                if (this.options.onChange) {
                    this.options.onChange(formElement.value, formElement, UIElement);
                }
            },

            /**
             * Selects the toggle item.
             * @param {Number} index - The index of the toggle item
             */
            select: function (index) {
                var input = this.getFormElement(index),
                    toggle = this.getUIElement(index);
                if (!input.checked) {
                    input.checked = true;
                    Utils.addClass(toggle, this.selectedClass);
                    this.triggerChange(input, toggle);
                }

                if (this.isRadio()) {
                    this._triggerAll(function (formElement, UIElement, idx) {
                        if (!formElement.checked) {
                            // deselect all other toggles if they are radio buttons
                            this.deselect(idx);
                        }
                    }.bind(this));
                }

            },

            /**
             * De-selects the toggle item.
             * @param {Number} index - The index of the toggle item
             */
            deselect: function (index) {
                var input = this.getFormElement(index),
                    toggle = this.getUIElement(index);
                Utils.removeClass(toggle, this.selectedClass);
                if (input.checked) {
                    input.checked = false;
                    this.triggerChange(input, toggle);
                }
            },

            /**
             * Gets the toggle input element by an index.
             * @param {Number} [index] - The index of the toggle input element
             * @returns {HTMLInputElement} Returns the checkbox input element
             */
            getFormElement: function (index) {
                return this.getFormElements()[(index || 0)];
            },

            /**
             * Gets the ui-version of the toggle element.
             * @param {Number} [index] - The index of the toggle element
             * @returns {HTMLElement} Returns the checkbox div element.
             */
            getUIElement: function (index) {
                return this.getUIElements()[(index || 0)];
            },

            /**
             * Enables the button toggle.
             */
            enable: function () {
                this._triggerAll(function (formElement, UIElement) {
                    formElement.disabled = false;
                    Utils.removeClass(UIElement, this.disabledClass);
                }.bind(this));
            },

            /**
             * Disables the button toggle.
             */
            disable: function () {
                this._triggerAll(function (formElement, UIElement) {
                    formElement.disabled = true;
                    Utils.addClass(UIElement, this.disabledClass);
                }.bind(this));
            },

            /**
             * Gets the unique identifier for button toggles.
             * @returns {string}
             */
            getElementKey: function () {
                if (this.isRadio()) {
                    return 'buttonToggleRadio';
                } else {
                    return 'buttonToggleCheckbox';
                }
            },

            /**
             * Destruction of this class.
             */
            destroy: function () {
                this._triggerAll(function (formElement, UIElement) {
                    UIElement.parentNode.replaceChild(formElement, UIElement);
                    Utils.removeEventListener(UIElement, 'click', this._onToggleClick.bind(this))
                }.bind(this));
                BaseFormElement.prototype.destroy.call(this);
            }

        });

        return ButtonToggle;
    });