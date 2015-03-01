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
        var eventName = 'my:event';
        var eventObj = {};
        EventManager.createTarget(eventObj);
        var eventListener = sinon.spy();
        eventObj.addEventListener(eventName, eventListener);
        eventObj.removeEventListener(eventName, eventListener);
        eventObj.dispatchEvent(eventName);
        assert.equal(eventListener.callCount, 0);
        EventManager.destroyTarget(eventObj);
    });

    it('should call a listener who has been added to an object, even if createTarget is called on it again', function () {
        var EventManager = require('event-manager');
        var eventName = 'evt:event2';
        var eventObj = {};
        var eventListener = sinon.spy();
        EventManager.createTarget(eventObj);
        eventObj.addEventListener(eventName, eventListener);
        EventManager.createTarget(eventObj);
        eventObj.dispatchEvent(eventName);
        assert.equal(eventListener.callCount, 1);
        EventManager.destroyTarget(eventObj);
    });

    it('should not call a listener after its target is destroyed', function () {
        var EventManager = require('event-manager');
        var eventName = 'destroyed:event';
        var eventObj = {};
        EventManager.createTarget(eventObj);
        var eventListener = sinon.spy();
        eventObj.addEventListener(eventName, eventListener);
        eventObj.removeEventListener(eventName, eventListener);
        EventManager.destroyTarget(eventObj);
        eventObj.dispatchEvent(eventName);
        assert.equal(eventListener.callCount, 0);
    });

});
