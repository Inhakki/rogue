"use strict";

// set config options
require.config({
    baseUrl: '../',
    paths: {
        qunit: 'tests/libs/qunit/qunit-require',
        sinon: 'tests/libs/sinon/sinon'
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
    'tests/cache-manager-tests'
], function() {
    QUnit.config.requireExpects = true;
    QUnit.start();
});