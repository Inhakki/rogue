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
        QUnit.equal(CacheManager.getCacheData(dataKey), undefined, 'data is not cached initially');
        CacheManager.cacheData(dataKey, mockData);
        QUnit.deepEqual(CacheManager.getCacheData(dataKey), mockData, 'caching data and then retrieving it was successful');
        CacheManager.flushData(dataKey);
        QUnit.equal(CacheManager.getCacheData(dataKey), null, 'after flushing data, data is no longer available');
        CacheManager.stop();
        CacheManager.flushAll();
    });

    QUnit.test('caching secret, password-protected data ', function() {
        QUnit.expect(7);
        var dataKey = 'myKey';
        var secretKey = 's78d9AGEdj2493jklda10sdgjdfgj@';
        var mockData = {testing: 'data', it: 'should work'};
        CacheManager.start();
        QUnit.equal(CacheManager.getCacheData(dataKey), undefined, 'data is not cached initially');
        CacheManager.cacheData(dataKey, mockData, secretKey);
        QUnit.equal(CacheManager.getCacheData(dataKey), undefined, 'trying to retrieve protected data without a secret key returns nothing');
        QUnit.equal(CacheManager.getCacheData(dataKey, 'wrongpw'), undefined, 'trying to retrieve protected data with a wrong secret key returns nothing');
        QUnit.deepEqual(CacheManager.getCacheData(dataKey, secretKey), mockData, 'trying to retrieve protected data with the correct secret key returns the object');
        CacheManager.flushData(dataKey);
        QUnit.equal(CacheManager.getCacheData(dataKey, secretKey), mockData, 'trying to remove protected data without its secret key is not successful');
        CacheManager.flushData(dataKey, 'wrongpw');
        QUnit.equal(CacheManager.getCacheData(dataKey, secretKey), mockData, 'trying to remove protected data with a wrong secret key is not successful');
        CacheManager.flushData(dataKey, secretKey);
        QUnit.equal(CacheManager.getCacheData(dataKey), null, 'removing protected data with correct secret is successful');
        CacheManager.stop();
        CacheManager.flushAll();
    });

    QUnit.test('caching data when manager hasn\'t been started', function () {
        QUnit.expect(5);
        var dataKey = 'myKey';
        var mockData = {testing: 'data', it: 'should work'};
        var getDataSpy = Sinon.spy(CacheManager, 'getCacheData');
        var setDataSpy = Sinon.spy(CacheManager, 'cacheData');
        try {
            CacheManager.cacheData();
        } catch (e) {
            QUnit.ok(setDataSpy.getCall(0).exception, 'an exception is thrown when trying to set data without starting cache manager');
        }
        try {
            CacheManager.getCacheData();
        } catch (e) {
            QUnit.ok(getDataSpy.getCall(0).exception, 'an exception is thrown when trying to get data without starting cache manager');
        }
        CacheManager.start();
        CacheManager.cacheData(dataKey, mockData);
        QUnit.ok(!setDataSpy.getCall(1).exception, 'no exception was thrown when caching data after manager has been started');
        CacheManager.getCacheData(dataKey);
        QUnit.ok(!getDataSpy.getCall(1).exception, 'no exception was thrown when retrieving data');
        CacheManager.flushData(dataKey);
        QUnit.equal(CacheManager.getCacheData(dataKey), null, 'after flushing data, data is no longer available');
        CacheManager.stop();
        CacheManager.flushAll();
        getDataSpy.restore();
        setDataSpy.restore();
    });


});