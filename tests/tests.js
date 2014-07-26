"use strict";

// set config options
require.config({
    'baseUrl': '',
    'paths': {
        qunit: 'libs/qunit/qunit-require',
        sinon: 'libs/sinon/sinon-1.9.0',
        framework: '../../workspace'
    },
    shim: {
        sinon: {
            exports: 'sinon'
        }
    },
    map: {
        'framework/utils': {
            // we must remap core utils for tests
            'framework/libs/core-modules/akqa-core/utils': '../../build/libs/core-modules/akqa-core/utils'
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