define([
    'sinon',
    'qunit',
    'framework/cache-manager'
], function(
    Sinon,
    QUnit,
    CacheManager
){
    "use strict";

    QUnit.module('Cache Manager Tests');

    QUnit.test('caching data', function () {
        QUnit.expect(3);
        var dataKey = 'myKey';
        var mockData = {testing: 'data', it: 'should work'};
        CacheManager.start();
        QUnit.equal(CacheManager.getValue(dataKey), undefined, 'data is not cached initially');
        CacheManager.setValue(dataKey, mockData);
        QUnit.deepEqual(CacheManager.getValue(dataKey), mockData, 'caching data and then retrieving it was successful');
        CacheManager.flushValue(dataKey);
        QUnit.equal(CacheManager.getValue(dataKey), null, 'after flushing data, data is no longer available');
        CacheManager.stop();
        CacheManager.flushAll();
    });

    QUnit.test('caching secret, password-protected data ', function() {
        QUnit.expect(7);
        var dataKey = 'myKey';
        var secretKey = 's78d9AGEdj2493jklda10sdgjdfgj@';
        var mockData = {testing: 'data', it: 'should work'};
        CacheManager.start();
        QUnit.equal(CacheManager.getValue(dataKey), undefined, 'data is not cached initially');
        CacheManager.setValue(dataKey, mockData, secretKey);
        QUnit.equal(CacheManager.getValue(dataKey), undefined, 'trying to retrieve protected data without a secret key returns nothing');
        QUnit.equal(CacheManager.getValue(dataKey, 'wrongpw'), undefined, 'trying to retrieve protected data with a wrong secret key returns nothing');
        QUnit.deepEqual(CacheManager.getValue(dataKey, secretKey), mockData, 'trying to retrieve protected data with the correct secret key returns the object');
        CacheManager.flushValue(dataKey);
        QUnit.equal(CacheManager.getValue(dataKey, secretKey), mockData, 'trying to remove protected data without its secret key is not successful');
        CacheManager.flushValue(dataKey, 'wrongpw');
        QUnit.equal(CacheManager.getValue(dataKey, secretKey), mockData, 'trying to remove protected data with a wrong secret key is not successful');
        CacheManager.flushValue(dataKey, secretKey);
        QUnit.equal(CacheManager.getValue(dataKey), null, 'removing protected data with correct secret is successful');
        CacheManager.stop();
        CacheManager.flushAll();
    });

    QUnit.test('setting and getting cache data (using deprecated methods)', function() {
        QUnit.expect(3);
        var dataKey = 'myKey';
        var secretKey = 's78d9AGEdj2493jklda10sdgjdfgj@';
        var mockData = {testing: 'data', it: 'should work'};
        var getValueStub = Sinon.stub(CacheManager, 'getValue');
        var setValueStub = Sinon.stub(CacheManager, 'setValue');
        var flushValueStub = Sinon.stub(CacheManager, 'flushValue');
        CacheManager.start();
        CacheManager.cacheData(dataKey, mockData, secretKey);
        QUnit.deepEqual(setValueStub.args[0], [dataKey, mockData, secretKey], 'calling deprecated cacheData() method calls setValue() with correct args');
        CacheManager.getCacheData(dataKey, secretKey);
        QUnit.deepEqual(getValueStub.args[0], [dataKey, secretKey], 'calling deprecated getCacheData() method calls getValue() with correct args');
        CacheManager.flushData(dataKey, secretKey);
        QUnit.deepEqual(flushValueStub.args[0], [dataKey, secretKey], 'calling deprecated flushData() method calls flushValue() with correct args');
        CacheManager.stop();
        CacheManager.flushAll();
        getValueStub.restore();
        flushValueStub.restore();
        setValueStub.restore();
    });

    QUnit.test('caching data when manager hasn\'t been started', function () {
        QUnit.expect(5);
        var dataKey = 'myKey';
        var mockData = {testing: 'data', it: 'should work'};
        var getValueSpy = Sinon.spy(CacheManager, 'getValue');
        var setValueSpy = Sinon.spy(CacheManager, 'setValue');
        try {
            CacheManager.setValue();
        } catch (e) {
            QUnit.ok(setValueSpy.getCall(0).exception, 'an exception is thrown when trying to set data without starting cache manager');
        }
        try {
            CacheManager.getValue();
        } catch (e) {
            QUnit.ok(getValueSpy.getCall(0).exception, 'an exception is thrown when trying to get data without starting cache manager');
        }
        CacheManager.start();
        CacheManager.setValue(dataKey, mockData);
        QUnit.ok(!setValueSpy.getCall(1).exception, 'no exception was thrown when caching data after manager has been started');
        CacheManager.getValue(dataKey);
        QUnit.ok(!getValueSpy.getCall(1).exception, 'no exception was thrown when retrieving data');
        CacheManager.flushValue(dataKey);
        QUnit.equal(CacheManager.getValue(dataKey), null, 'after flushing data, data is no longer available');
        CacheManager.stop();
        CacheManager.flushAll();
        getValueSpy.restore();
        setValueSpy.restore();
    });


});