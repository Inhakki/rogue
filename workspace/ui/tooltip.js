define([
    'framework/framework',
    'framework/utils'
],
function (App, Utils) {
    "use strict";

    var Tooltip = function (options) {
        this.initialize(options);
    };

    Tooltip.prototype = {

        /**
         * Initializes the toggle button.
         * @param {object} options - Options to pass
         * @param {HTMLElement} options.el - The container of the tooltip
         * @param {string} options.event - A string of the event that will trigger showing/hiding of the tooltip
         */
        initialize: function (options) {

            this.options = _.extend({
                el: null,
                event: 'click'
            }, options);

            this.activeClass = 'ui-tooltip-active';

            this.el = this.options.el;
            this.trigger = Utils.getElementsByClassName('ui-tooltip-trigger', this.el)[0];
            this.panel = Utils.getElementsByClassName('ui-tooltip-panel', this.el)[0];

            this._setupEvents();

        },

        /**
         * Sets up events for showing/hiding tooltip.
         * @private
         */
        _setupEvents: function () {
            Utils.addEventListener(this.trigger, this.options.event, this._onEvent.bind(this));
        },

        /**
         * When an event is triggered.
         * @private
         */
        _onEvent: function () {
            if (this.options.event === 'click') {
                if (this.isActive()) {
                    this.hide();
                } else {
                    this.show();
                }
            }
        },

        /**
         * Shows the tooltip.
         */
        show: function () {
            Utils.addClass(this.el, this.activeClass);
        },

        /**
         * Hides the tooltip.
         */
        hide: function () {
            Utils.removeClass(this.el, this.activeClass);
        },

        /**
         * Checks whether tooltip is showing.
         * @returns {boolean} Returns true if showing
         */
        isActive: function () {
            return Utils.hasClass(this.el, this.activeClass);
        },

        /**
         * Set tooltip panel text.
         * @param {string} value - The new value
         */
        setPanelText: function (value) {
            if (!Utils.isIE8) {
                this.panel.textContent = value;
            } else {
                this.panel.innerText = value;
            }
        },

        /**
         * Destruction of this class.
         */
        destroy: function () {
            Utils.removeEventListener(this.trigger, this.options.event, this._onEvent.bind(this));
        }

    };

    return Tooltip;
});