define([
    frameworkConfig.modulePath + '/framework',
    frameworkConfig.modulePath + '/utils'
], function (App, Utils) {
    "use strict";

    var Tooltip = function (options) {
        this.initialize(options);
        return this;
    };

    Tooltip.prototype = {

        /**
         * Initializes the toggle button.
         * @param {object} options - Options to pass
         * @param {Array} options.showEvents - An array of event strings to trigger showing the tooltip
         * @param {Array} options.hideEvents - An array of event strings to trigger hiding the tooltip
         */
        initialize: function (options) {

            this.options = _.extend({
                el: null,
                event: 'click'
            }, options);

            this.showClass = 'ui-tooltip-showing';

            this.el = this.options.el;
            this.trigger = Utils.getElementsByClassName('ui-tooltip-trigger', this.el)[0];
            this.panel = Utils.getElementsByClassName('ui-tooltip-panel', this.el)[0];

            _.bindAll(this, '_onEvent');

            this._setupEvents();

        },

        /**
         * Sets up events for showing/hiding tooltip.
         * @private
         */
        _setupEvents: function () {
            var options = this.options,
                trigger = this.trigger,
                i;

            Utils.addEventListener(trigger, this.options.event, this._onEvent);
        },

        /**
         * When an event is triggered.
         * @private
         */
        _onEvent: function () {
            if (this.options.event === 'click') {
                if (this.isShowing()) {
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
            Utils.addClass(this.el, this.showClass);
        },

        /**
         * Hides the tooltip.
         */
        hide: function () {
            Utils.removeClass(this.el, this.showClass);
        },

        /**
         * Checks whether tooltip is showing.
         * @returns {boolean} Returns true if showing
         */
        isShowing: function () {
            return Utils.hasClass(this.el, this.showClass);
        }

    };

    return Tooltip;
});