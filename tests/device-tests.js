var sinon = require('sinon');
var assert = require('assert');
var EventManager = require('../src/event-manager');

describe('Device', function (){
    it('isMobile() should return false if nav user agent is empty string', function (){
        var userAgentMock = '';
        var eventManagerCreateTargetStub = sinon.stub(EventManager, 'createTarget');
        var eventManagerDestroyTargetStub = sinon.stub(EventManager, 'destroyTarget');
        var device = require('./../src/device');
        var getUserAgentStub = sinon.stub(device, 'getUserAgent').returns(userAgentMock);
        assert.equal(device.isMobile(), false);
        device.destroy();
        eventManagerCreateTargetStub.restore();
        eventManagerDestroyTargetStub.restore();
        getUserAgentStub.restore();
    });

    it('Chrome for Android should return true for isMobile() and when passing "android" to isOS()', function (){
        var userAgentMock = 'Mozilla/5.0 (Linux; Android 4.0.4; ' +
            'Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) ' +
            'Chrome/18.0.1025.133 Mobile Safari/535.19';
        var eventManagerCreateTargetStub = sinon.stub(EventManager, 'createTarget');
        var eventManagerDestroyTargetStub = sinon.stub(EventManager, 'destroyTarget');
        var device = require('./../src/device');
        var getUserAgentStub = sinon.stub(device, 'getUserAgent').returns(userAgentMock);
        assert.equal(device.isMobile(), true, 'isMobile() returns true');
        assert.equal(device.isBrowser('chrome'), true, 'isBrowser() returns true');
        assert.equal(device.isOS('android'), true, 'isOS() returns true');
        device.destroy();
        eventManagerCreateTargetStub.restore();
        eventManagerDestroyTargetStub.restore();
        getUserAgentStub.restore();
    });
});
