define(['underscore', 'element-kit'], function () {
    "use strict";

    var Tooltip = function (options) {
        this.initialize(options);
    };

    Tooltip.prototype = {

        /**
         * Initializes the Tooltip.
         * @param {object} options - Options to pass
         * @param {HTMLElement} options.el - The container of the tooltip
         * @param {string} [options.showEvent] - A string indicating which event should trigger showing the tooltip
         * @param {string} [options.hideEvent] - A string indicating which event should trigger hiding the tooltip
         * @param {Function} [options.onShow] - A callback function that fires when tooltip panel is shown
         * @param {Function} [options.onHide] - A callback function that fires when tooltip panel is hidden
         * @param {string} [options.cssPrefix] - A custom css class that will be used as namespace for all css classes applied
         */
        initialize: function (options) {

            this.options = _.extend({
                el: null,
                showEvent: null,
                hideEvent: null,
                onShow: null,
                onHide: null,
                cssPrefix: 'ui-tooltip'
            }, options);

            this.prefix = this.options.cssPrefix;
            this.activeClass = this.prefix + '-active';

            this.el = this.options.el;
            this.trigger = this.el.getElementsByClassName(this.prefix + '-trigger')[0];

            this.setup();

        },

        /**
         * Sets up events for showing/hiding tooltip.
         */
        setup: function () {
            var options = this.options;

            // setup events if needed
            if (options.showEvent) {
                this.eventMap = this._setupEvents(options.showEvent, options.hideEvent);
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
                    this.trigger.addEventListener(e.name, e.event);
                }
            }
            return map;
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
            this.el.kit.classList.add(this.activeClass);
            if (this.options.onShow) {
                this.options.onShow();
            }
        },

        /**
         * Hides the tooltip.
         */
        hide: function () {
            this.el.kit.classList.remove(this.activeClass);
            if (this.options.onHide) {
                this.options.onHide();
            }
        },

        /**
         * Checks whether tooltip is showing.
         * @returns {boolean} Returns true if showing
         */
        isActive: function () {
            return this.el.kit.classList.contains(this.activeClass);
        },

        /**
         * Destruction of this class.
         */
        destroy: function () {
            var eventMap = this.eventMap,
                key,
                e;

            // destroy events
            if (eventMap) {
                for (key in eventMap) {
                    if (eventMap.hasOwnProperty(key)) {
                        e = eventMap[key];
                        this.trigger.removeEventListener(e.name, e.event);
                    }
                }
            }
        }

    };

    return Tooltip;
});