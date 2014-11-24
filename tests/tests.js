"use strict";

// set config options
require.config({
    baseUrl: '../',
    paths: {
        qunit: 'tests/libs/qunit-require',
        sinon: 'external/sinon/sinon'
    },
    shim: {
        sinon: {
            exports: 'sinon'
        }
    }
});

// require each test
require([
    'tests/modules/tooltip-tests',
    'tests/modules/modal-tests'
], function() {
    QUnit.config.requireExpects = true;
    QUnit.start();
});