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

                this.setup();

            },

            /**
             * Sets up html.
             */
            setup: function () {
                var container,
                    isCheckedOnInit = this.el.checked;
                if (!Utils.hasClass(this.el, 'ui-checkbox')) {
                    console.error('checkbox cannot be created: no ui-checkbox class!');
                } else {
                    this.container = Utils.wrapHtmlElement(this.el, '<div class="ui-checkbox-container"></div>');
                }

                // if input element is already checked initially, check it!
                if (isCheckedOnInit) {
                    this.check();
                    this.isCheckedOnInit = isCheckedOnInit;
                }

            },

            /**
             * Checks whether the checkbox is checked.
             */
            isChecked: function () {
                return Utils.hasClass(this.container, this.checkedClass);
            },

            /**
             * Checks the checkbox.
             */
            check: function () {
                this.el.setAttribute('checked', 'checked');
                Utils.addClass(this.container, this.checkedClass);
                if (this.options.onChecked) {
                    this.options.onChecked(this.el.value);
                }
            },

            /**
             * Un-checks the checkbox.
             */
            uncheck: function () {
                this.el.removeAttribute('checked');
                Utils.removeClass(this.container, this.checkedClass);
                if (this.options.onUnchecked) {
                    this.options.onUnchecked(this.el.value);
                }
            },


            /**
             * Destruction of this class.
             */
            destroy: function () {
                var container = this.container;
                // put html back to the way it was!
                container.parentNode.replaceChild(this.el, this.container);
                if (this.isCheckedOnInit) {
                    this.el.setAttribute('checked', 'checked');
                }
            }

        };

        return Checkbox;
    });