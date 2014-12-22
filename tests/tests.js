"use strict";

// set config options
require.config({
    baseUrl: '../',
    paths: {
        qunit: 'tests/qunit-require',
        sinon: 'bower_components/sinonjs/sinon',
        underscore: 'bower_components/underscore/underscore',
        'element-kit': 'bower_components/element-kit/dist/element-kit',
        'test-utils': 'tests/test-utils'
    },
    shim: {
        sinon: {
            exports: 'sinon'
        }
    }
});

// require each test
require([
    'tests/tooltip-tests',
    'tests/modal-tests',
    'tests/cache-manager-tests',
    'tests/carousel-tests'
], function() {
    QUnit.config.requireExpects = true;
    QUnit.start();
});