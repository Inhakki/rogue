"use strict";

// set config options
require.config({
    'baseUrl': '',
    'paths': {
        qunit: 'libs/qunit-require',
        sinon: '../external/sinon/sinon',
        underscore: '../external/underscore/underscore',
        'element-kit': '../external/element-kit/utils'
    },
    shim: {
        sinon: {
            exports: 'sinon'
        }
    }
});

// require each test
require([
    'modules/tooltip-tests'
], function() {
    QUnit.config.requireExpects = true;
    QUnit.start();
});