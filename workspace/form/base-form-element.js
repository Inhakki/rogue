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
         * @returns {HTMLInputElement} Returns the input field element
         * @abstract
         */
        getFormElement: function () {
            console.error('form element: getFormElement() method not implemented');
        },

        /**
         * Gets the ui version of the form element.
         * @returns {HTMLElement} Returns the checkbox div element.
         * @abstract
         */
        getUIElement: function () {
            console.error('form element: getUIElement() method not implemented');
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
         * Gets the key (must be unique from all other form elements) that is associated.
         * @returns {string} Return the unique key
         * @abstract
         */
        getElementKey: function () {
            console.error('form element: getUIElement() method not implemented');
        },

        /**
         * Destruction of this class.
         */
        destroy: function () {}

    };

    return BaseFormElement;
});