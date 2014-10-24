"use strict";

// set config options
require.config({
    baseUrl: './',
    paths: {
        qunit: 'libs/qunit-require',
        sinon: '../external/sinon/sinon',
        'element-utils': '../external/element-kit/utils'
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