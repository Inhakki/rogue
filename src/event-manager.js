var Promise = require('promise');
var request = require('request');
var utils = require('utils');

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
    },

    /**
     * Registers a callback to be fired when the url changes.
     * @param {Object|Function} target
     * @param {String} eventName
     * @param {Function} listener
     * @param {boolean} useCapture
     * @param {Object} [context]
     */
    _addEvent: function (target, eventName, listener, useCapture, context) {

        if (typeof useCapture !== 'boolean') {
            context = useCapture;
            useCapture = null;
        }

        // replicating native JS default useCapture option
        useCapture = useCapture || false;

        this._targets[target] = this._targets[target] || {};

        // dont add event listener if target already has it
        var existingListeners = utils.getNested(this._targets[target], eventName, []);
        var listenerObj = {
            listener: listener,
            context: context,
            useCapture: useCapture
        };
        if (existingListeners.indexOf(listenerObj) === -1) {
            var listenerArr = utils.setNested(this._targets[target], eventName, []);
            listenerArr.push(listenerObj);
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
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(target);
            this[method].apply(this, args);
        }.bind(this);
    },

    /**
     * Removes an event listener from the target.
     * @private
     * @param target
     * @param eventName
     * @param listener
     */
    _removeEvent: function (target, eventName, listener) {
        var existingListeners = utils.getNested(this._targets[target], eventName, []);
        existingListeners.forEach(function (listenerObj, idx) {
            if (listenerObj.listener === listener) {
                existingListeners.splice(idx, 1);
            }
        });
    },

    /**
     * Triggers all event listeners on a target.
     * @private
     * @param {Object|Function} target - The target
     * @param {String} eventName - The event name
     */
    _dispatchEvent: function (target, eventName) {
        var targetObj = this._targets[target] || {};
        if (targetObj[eventName]) {
            targetObj[eventName].forEach(function (listenerObj) {
                listenerObj.listener.call(listenerObj.context || target, this._createEvent(eventName));
            }.bind(this));
        }
    },

    /**
     * Creates an event.
     * @param {string} eventName - The event name
     * @private
     */
    _createEvent: function (eventName) {
        // For IE 9+ compatibility, we must use document.createEvent() for our CustomEvent.
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(eventName, false, false, {});
        return evt;
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