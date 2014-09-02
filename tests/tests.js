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
    }
});

// require each test
require([
    'utils-tests',
    'ui/tooltip-tests',
    'ui/checkbox-tests',
    'ui/button-toggle-tests',
    'ui/input-field-tests',
    'cache-manager-tests'
], function() {
    QUnit.config.requireExpects = true;
    QUnit.start();
});