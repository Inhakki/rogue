var Promise = require('promise');
var request = require('request');

'use strict';
/**
 A class to add a simple EventTarget (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) API
 around any object or function, so that it can begin to receive and trigger event listeners.
 @class EventManager
 */

var EventManager = {

    /**
     * Registers a target to begin receiving and triggering events.
     * @param {Object|Function} target - The target
     */
    createTarget: function (target) {
        this._targets = this._targets = {};

        target.addEventListener = this._getEventMethod(target, '_addEvent').bind(this);
        target.removeEventListener = this._getEventMethod(target, '_removeEvent').bind(this);
        target.dispatchEvent = this._getEventMethod(target, '_dispatchEvent').bind(this);

        this._targets[target] = target;
    },

    /**
     * Registers a callback to be fired when the url changes.
     * @param {Object|Function} target
     * @param {String} event
     * @param {Function} listener
     * @param {boolean} useCapture
     * @param {Object} [context]
     */
    _addEvent: function (target, event, listener, useCapture, context) {
        var targetObj = this._targets[target] || {};

        if (typeof useCapture !== 'boolean') {
            context = useCapture;
            useCapture = null;
        }

        // replicating native JS default useCapture option
        useCapture = useCapture || false;

        targetObj[event] = targetObj[event] || {};

        // dont add event listener if target already has it
        if (!targetObj[event][listener]) {
            targetObj[event][listener] = targetObj[event][listener] || [];
            targetObj[event][listener].push({
                context: context,
                useCapture: useCapture
            });
            this._targets[target] = targetObj;
        }
    },

    /**
     * Returns our internal method for a target.
     * @private
     * @param target
     * @param method
     * @returns {*|function(this:EventManager)}
     */
    _getEventMethod: function (target, method) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(target);
         return function () {
            this[method].apply(this, args);
         }.bind(this);
    },

    /**
     * Removes an event listener from the target.
     * @private
     * @param target
     * @param event
     * @param listener
     */
    _removeEvent: function (target, event, listener) {
        var targetObj = this._targets[target] || {};
        if (targetObj) {
            if (targetObj[event] && targetObj[event][listener]) {
                delete targetObj[event][listener];
                // clean up parent
                if (!targetObj[event]) {
                    delete targetObj[event];
                    if (!this._targets[target]) {
                        delete this._targets[target];
                    }
                }
            }
        }
    },

    /**
     * Triggers all event listeners on a target.
     * @private
     * @param {Object|Function} target - The target
     * @param event
     */
    _dispatchEvent: function (target, event) {
        var targetObj = this._targets[target] || {};
        if (targetObj && targetObj[event]) {
            targetObj[event].listeners.forEach(function (listener) {
                listener.call(listener.context || target, this._createEvent(event));
            }.bind(this));
        }
    },

    /**
     * Creates an event.
     * @param {string} event - The event name
     * @private
     */
    _createEvent: function (event) {
        // For IE 9+ compatibility, we must use document.createEvent() for our CustomEvent.
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, false, false, {});
        return event;
    },

    /**
     * Removes all event listeners from target.
     * @param target
     */
    destroyTarget: function (target) {
        delete this._targets[target];
    }
};

module.exports = EventManager;