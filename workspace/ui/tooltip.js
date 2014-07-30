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
         * Initializes the Tooltip.
         * @param {object} options - Options to pass
         * @param {HTMLElement} options.el - The container of the tooltip
         * @param {string} options.showEvent - A string indicating which event should trigger showing the tooltip
         * @param {string} options.hideEvent - A string indicating which event should trigger hiding the tooltip
         * @param {Function} options.onShow - A callback function that fires when tooltip panel is shown
         * @param {Function} options.onHide - A callback function that fires when tooltip panel is hidden
         */
        initialize: function (options) {

            this.options = Utils.extend({
                el: null,
                showEvent: null,
                hideEvent: null,
                onShow: null,
                onHide: null
            }, options);

            this.activeClass = 'ui-tooltip-active';

            this.el = this.options.el;
            this.trigger = Utils.getElementsByClassName('ui-tooltip-trigger', this.el)[0];
            this.panel = Utils.getElementsByClassName('ui-tooltip-panel', this.el)[0];

            this.setup();

        },

        /**
         * Sets up events for showing/hiding tooltip.
         */
        setup: function () {
            var options = this.options;

            // setup events if needed
            if (options.showEvent) {
                this._setupEvents(options.showEvent, options.hideEvent);
            }
        },

        /**
         * Sets up events.
         * @param {string} showEvent - The event string to hide tooltip
         * @param {string} hideEvent - The event string to show tooltip
         * @returns {object} - Returns a mapping of all events to their trigger functions.
         * @private
         */
        _setupEvents: function (showEvent, hideEvent) {
            var map = this._buildEventMap(showEvent, hideEvent),
                key,
                e;
            for (key in map) {
                if (map.hasOwnProperty(key)) {
                    e = map[key];
                    Utils.addEventListener(this.trigger, e.name, e.event);
                }
            }
            this.eventMap = map;
        },

        /**
         * Fires when the show and hide events are the same and we need to determine whether to show or hide.
         * @private
         */
        _onDuplicateEvent: function () {
            if (this.isActive()) {
                this.hide();
            } else {
                this.show();
            }
        },


        /**
         * Builds the event map.
         * @param {string} showEvent - The event string to hide tooltip
         * @param {string} hideEvent - The event string to show tooltip
         * @returns {object} - Returns a mapping of all events to their trigger functions.
         * @private
         */
        _buildEventMap: function (showEvent, hideEvent) {
            var map = {};

            if (showEvent === hideEvent) {
                // show event and hide events are the same
                map['showEvent'] = {
                    name: showEvent,
                    event: this._onDuplicateEvent.bind(this)
                };
                return map;
            }

            if (showEvent) {
                map['showEvent'] = {
                    name: showEvent,
                    event: this.show.bind(this)
                }
            }
            if (hideEvent) {
                map['hideEvent'] = {
                    name: hideEvent,
                    event: this.hide.bind(this)
                }
            }
            return map;
        },

        /**
         * Shows the tooltip.
         */
        show: function () {
            Utils.addClass(this.el, this.activeClass);
            if (this.options.onShow) {
                this.options.onShow();
            }
        },

        /**
         * Hides the tooltip.
         */
        hide: function () {
            Utils.removeClass(this.el, this.activeClass);
            if (this.options.onHide) {
                this.options.onHide();
            }
        },

        /**
         * Checks whether tooltip is showing.
         * @returns {boolean} Returns true if showing
         */
        isActive: function () {
            return Utils.hasClass(this.el, this.activeClass);
        },

        /**
         * Destruction of this class.
         */
        destroy: function () {
            var eventMap = this.eventMap,
                key;

            // destroy events
            if (eventMap) {
                for (key in eventMap) {
                    var e = eventMap[key];
                    if (eventMap.hasOwnProperty(key)) {
                        Utils.removeEventListener(this.trigger, e.name, e.event);
                    }
                }
            }
        }

    };

    return Tooltip;
});