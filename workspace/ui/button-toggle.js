define([
    'framework/framework',
    'framework/utils',
    'framework/form/base-form-element',
    'framework/ui/button-toggle-element'
],
    function (App, Utils, BaseFormElement, ButtonToggleElement) {
        "use strict";

        var ButtonToggle = function (options) {
            this.initialize(options);
        };

        ButtonToggle.prototype = Utils.extend({}, BaseFormElement.prototype, {

            /**
             * Initialization.
             * @param {object} options - Options to pass
             * @param {HTMLInputElement} options.container - The element that contains the toggle elements
             * @param {Function} [options.onChange] - A callback function that fires when of the toggle elements are selected
             * @param {string} [options.cssPrefix] - A custom css class that will be used as namespace for all css classes applied
             */
            initialize: function (options) {

                this.options = Utils.extend({
                    container: null,
                    onChange: null,
                    cssPrefix: 'ui-button-toggle'
                }, options);

                BaseFormElement.prototype.initialize.call(this, options);

                this._container = this.options.container;

                var toggleItems = Utils.getElementsByClassName(this.options.cssPrefix + '-input', this._container);
                if (!toggleItems.length) {
                    console.error('could not build toggle items: container has no matching nested toggle items with ' + this.options.cssPrefix + ' class');
                } else {
                    this._elementMap = this._buildToggleMap(toggleItems);
                }

            },

            /**
             * Creates a mapping of all toggles, grouping them by their name attribute.
             * @param {HTMLCollection} elements - An array-like group of button toggle elements
             * @returns {Array} Returns the map instances
             * @private
             */
            _buildToggleMap: function (elements) {
                var map = [],
                    el,
                    options;
                for (var i = 0; i < elements.length; i++) {
                    el = elements.item(i);
                    options = this._buildInstanceOptions(el);
                    map.push(new ButtonToggleElement(options));
                }
                return map;
            },

            /**
             * Builds the config options for the button toggle element instance.
             * @param {HTMLElement} el - The element
             * @private
             */
            _buildInstanceOptions: function (el) {
                var options = {
                    el: el,
                    onSelected: this._onToggleSelect.bind(this),
                    cssPrefix: this.options.cssPrefix
                };
                return options;
            },

            /**
             * Gets the object that maps all toggles by their name attribute.
             * @returns {*}
             */
            getToggleElementMap: function () {
                return this._elementMap;
            },

            /**
             * When a toggle item is selected.
             * @param {string} value - The value of the toggle input that has been selected
             * @param {HTMLInputElement} el - The selected toggle input el
             * @param {HTMLElement} container - The container of selected toggle item
             * @private
             */
            _onToggleSelect: function (value, el, container) {
                var items = this.getToggleElementMap(),
                    unselectedItems = [],
                    instance,
                    i;

                for (i = 0; i < items.length; i++) {
                    instance = items[i];
                    // deselect all other ones if they are radio buttons
                    if (instance.getFormElement().value !== value && instance.isRadio()) {
                        unselectedItems.push(instance);
                    }
                }

                this._triggerAll('deselect', unselectedItems);

                if (this.options.onChange) {
                    this.options.onChange(value, el, container);
                }
            },

            /**
             * Disables all button toggles that have the same name attribute.
             */
            disable: function () {
                this._triggerAll('disable', this.getToggleElementMap());
            },

            /**
             * Enable all button toggles that have the same name attribute.
             */
            enable: function () {
                this._triggerAll('enable', this.getToggleElementMap());
            },

            /**
             * Private delegator that triggers a method on all passed toggle items.
             * @param {string} method - The method to call
             * @param {Array} items - An array of toggle item instances
             * @param {...Array} [args] - Any arguments to be passed to the method
             * @private
             */
            _triggerAll: function (method, items) {
                var i,
                    instance,
                    args = Array.prototype.slice.call(arguments); // convert arguments to real array
                for (i = 0; i < items.length; i++) {
                    instance = items[i];
                    instance[method].apply(instance, args.slice(0, 2));
                }
            },

            /**
             * Gets the unique identifiers for button toggles by name.
             * @returns {string}
             */
            getElementKey: function () {
                // assume that the first toggle's element key is the same as the rest
                // since they should all be the same type
                return this.getToggleElementMap()[0].getElementKey();

            },

            /**
             * Destruction of this class.
             */
            destroy: function () {
                this._triggerAll('destroy', this.getToggleElementMap());
                BaseFormElement.prototype.destroy.call(this);
            }

        });

        return ButtonToggle;
    });