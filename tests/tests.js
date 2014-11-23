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
    },
    map: {
        '*': {
            // re-map element-utils to relative location to prevent tests from failing in browser
            'element-utils': 'external/element-kit/utils'
        }
    }
});

// require each test
require([
    'tests/modules/tooltip-tests'
], function() {
    QUnit.config.requireExpects = true;
    QUnit.start();
});