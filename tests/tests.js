"use strict";

// set config options
require.config({
    'baseUrl': '',
    'paths': {
        qunit: 'libs/qunit/qunit-require',
        sinon: 'libs/sinon/sinon-1.9.0',
        'core-utils': '/build/libs/core-modules/akqa-core/utils',
        framework: '../../workspace'
    },
    shim: {
        sinon: {
            exports: 'sinon'
        }
    }
});

// require each test
require([
    'modules/utils-tests',
    'modules/tooltip-tests'
], function() {
    QUnit.config.requireExpects = true;
    QUnit.start();
});