var sinon = require('sinon');
var TestUtils = require('test-utils');
var assert = require('assert');


describe('Event Manager', function () {

    it('registering an event listener on an object and then triggering it calls the listener function', function () {
        var EventManager = require('event-manager');
        var eventName = 'test:event';
        var eventObj = {};
        EventManager.createTarget(eventObj);
        var eventListener = sinon.spy();
        eventObj.addEventListener(eventName, eventListener);
        eventObj.dispatchEvent(eventName);
        assert.equal(eventListener.callCount, 1);
        EventManager.destroyTarget(eventObj);
    });

    it('un-registering an event listener on an object and then triggering it does not call the listener function', function () {
        var EventManager = require('event-manager');
        var eventName = 'test:event';
        var eventObj = {};
        EventManager.createTarget(eventObj);
        var eventListener = sinon.spy();
        eventObj.addEventListener(eventName, eventListener);
        eventObj.removeEventListener(eventName, eventListener);
        eventObj.dispatchEvent(eventName);
        assert.equal(eventListener.callCount, 0);
        EventManager.destroyTarget(eventObj);
    });

});
