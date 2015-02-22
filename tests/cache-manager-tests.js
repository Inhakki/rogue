var Sinon = require('sinon');
var QUnit = require('qunit');
var TestUtils = require('test-utils');
var CacheManager = require('../src/cache-manager');

module.exports = (function () {
    "use strict";

    QUnit.module('Cache Manager Tests');

    QUnit.asyncTest('setting and getting persistent data', function () {
        QUnit.expect(3);
        var dataKey = 'myKey';
        var mockData = {testing: 'data', it: 'should work'};
        var localStorageGetStub = Sinon.stub(localStorage, 'getItem');
        var localStorageSetStub = Sinon.stub(localStorage, 'setItem');
        var localStorageRemoveStub = Sinon.stub(localStorage, 'removeItem');
        CacheManager.setValue(dataKey, mockData, null, function () {
            QUnit.deepEqual(localStorageSetStub.args[0], [dataKey, mockData], 'calling the setter method calls correct localStorage method with correct args');
            CacheManager.getValue(dataKey, function () {
                QUnit.deepEqual(localStorageGetStub.args[0], [dataKey], 'calling the getter method calls correct localStorage method with correct args');
                CacheManager.flushValue(dataKey, function () {
                    QUnit.deepEqual(localStorageRemoveStub.args[0], [dataKey], 'calling the remove method calls correct localStorage method with correct args when localStorage contains the value');
                    localStorageGetStub.restore();
                    localStorageSetStub.restore();
                    localStorageRemoveStub.restore();
                    QUnit.start();
                });
            });
        });
    });

    QUnit.asyncTest('setting and getting session data', function () {
        QUnit.expect(3);
        var dataKey = 'myKey';
        var mockData = {testing: 'data', it: 'should work'};
        var sessionStorageGetStub = Sinon.stub(sessionStorage, 'getItem');
        var sessionStorageSetStub = Sinon.stub(sessionStorage, 'setItem');
        var sessionStorageRemoveStub = Sinon.stub(sessionStorage, 'removeItem');
        CacheManager.setSessionValue(dataKey, mockData, function () {
            QUnit.deepEqual(sessionStorageSetStub.args[0], [dataKey, mockData], 'calling the setter method calls correct sessionStorage method with correct args');
            CacheManager.getSessionValue(dataKey, function () {
                QUnit.deepEqual(sessionStorageGetStub.args[0], [dataKey], 'calling the getter method calls correct sessionStorage method with correct args');
                CacheManager.flushSessionValue(dataKey, function () {
                    QUnit.deepEqual(sessionStorageRemoveStub.args[0], [dataKey], 'calling the remove method calls correct sessionStorage method with correct args when sessionStorage contains the value');
                    sessionStorageGetStub.restore();
                    sessionStorageSetStub.restore();
                    sessionStorageRemoveStub.restore();
                    QUnit.start();
                });
            });
        });
    });

    QUnit.asyncTest('setting data with an expiration time', function () {
        QUnit.expect(2);
        var dataKey = 'myKey';
        var mockData = {testing: 'data', it: 'should work'};
        var localStorageGetStub = Sinon.stub(localStorage, 'getItem');
        var localStorageSetStub = Sinon.stub(localStorage, 'setItem');
        var localStorageRemoveStub = Sinon.stub(localStorage, 'removeItem');
        var flushExpiration = 400;
        var timed;
        CacheManager.setValue(dataKey, mockData, flushExpiration, function () {
            QUnit.equal(localStorageRemoveStub.callCount, 0, 'localStorage remove method was NOT called because timer did not run out yet');
            timed = setTimeout(function () {
                QUnit.deepEqual(localStorageRemoveStub.args[0], [dataKey], 'after timer runs out, localStorage method was called with correct args');
                clearTimeout(timed);
                localStorageGetStub.restore();
                localStorageSetStub.restore();
                localStorageRemoveStub.restore();
                QUnit.start();
            }, flushExpiration + 1);
        });
    });

    QUnit.test('setting and getting cache data (using deprecated methods)', function() {
        QUnit.expect(3);
        var dataKey = 'myKey';
        var secretKey = 's78d9AGEdj2493jklda10sdgjdfgj@';
        var mockData = {testing: 'data', it: 'should work'};
        var localStorageGetStub = Sinon.stub(localStorage, 'getItem');
        var localStorageSetStub = Sinon.stub(localStorage, 'setItem');
        var localStorageRemoveStub = Sinon.stub(localStorage, 'removeItem');
        CacheManager.cacheData(dataKey, mockData, secretKey);
        QUnit.deepEqual(localStorageSetStub.args[0], [dataKey, mockData], 'calling deprecated cacheData() method calls setValue() with correct args');
        CacheManager.getCacheData(dataKey, secretKey);
        QUnit.deepEqual(localStorageGetStub.args[0], [dataKey], 'calling deprecated getCacheData() method calls getValue() with correct args');
        CacheManager.flushData(dataKey, secretKey);
        QUnit.deepEqual(localStorageRemoveStub.args[0], [dataKey], 'calling deprecated flushData() method calls flushValue() with correct args');
        localStorageGetStub.restore();
        localStorageSetStub.restore();
        localStorageRemoveStub.restore();
    });


})();