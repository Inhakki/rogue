"use strict";

// set config options
require.config({
    'baseUrl': '',
    'paths': {
        qunit: 'libs/qunit/qunit-require',
        sinon: 'libs/sinon/sinon-1.9.0',
        workspace: '../workspace/',
        'core-utils': '../build/libs/core-modules/akqa-core/utils',
        framework: '../../build'
    },
    shim: {
        'core-utils': {
            exports: 'Core.Utils'
        }
    }
});

// require each test
require([
    'modules/utils-tests'
], function() {
    QUnit.config.requireExpects = true;
    QUnit.start();
});