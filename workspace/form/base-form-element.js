define(function () {
    "use strict";

    /**
     * Used as the base class from which all form elements should extend that primarily provides methods
     * that eliminate code redundancy and provide fallbacks for methods that which all forms should have.
     * @param options
     * @constructor
     */
    var BaseFormElement = function (options) {
        this.initialize(options);
    };

    BaseFormElement.prototype = {

        /**
         * Sets up stuff.
         */
        initialize: function (options) {},

        /**
         * Gets the form element.
         * @returns {HTMLElement} Returns the form element
         * @abstract
         */
        getFormElement: function () {
            return this.el;
        },

        /**
         * Gets the ui version of the form element.
         * @returns {HTMLElement} Returns the ui-version of the element.
         * @abstract
         */
        getUIElement: function () {
            return this.getFormElement();
        },

        /**
         * Enables the form element.
         */
        enable: function () {
            this.getFormElement().disabled = false;
        },

        /**
         * Disables the form element.
         */
        disable: function () {
            this.getFormElement().disabled = true;
        },

        /**
         * Gets the element's identifier (preferably unique form all other form elements).
         * @returns {string} Return the unique key
         * @abstract
         */
        getElementKey: function () {
            return 'element';
        },

        /**
         * Destruction of this class.
         */
        destroy: function () {}

    };

    return BaseFormElement;
});