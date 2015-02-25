var sinon = require('sinon');
var TestUtils = require('test-utils');
var ResourceManager = require('resource-manager');
var Router = require('router');
var assert = require('assert');

describe('Router Tests', function () {
    'use strict';

    it('triggering a route that has css', function () {
        var stylePath = 'path/to/my/stylesheet.css';
        var config = {
            'my/url': {
                styles: stylePath
            }
        };
        var url = 'my/testable/url';
        //Router.triggerRoute(url);
    });

    it('triggering a route that has a html template', function () {
        var templatePath = 'path/to/my/template.html';
        var config = {
            'my/url': {
                template: templatePath
            }
        };
        var url = 'my/testable/url';
        //Router.triggerRoute(url);
    });

    it('triggering a route that has script to load', function () {
        var templatePath = 'path/to/my/script.js';
        var config = {
            'my/script/url': {
                script: templatePath
            }
        };
        //Router.triggerRoute(url);
    });

    //it('triggering a route', function () {
    //    var url = 'my/testable/url';
    //    var backboneRouterNavigateStub = Sinon.stub(Router, 'navigate');
    //    Router.triggerRoute(url);
    //    QUnit.deepEqual(backboneRouterNavigateStub.args[0], [url, {trigger: true}], 'on triggering route, Backbone.Routers\'s navigate method was called with correct args');
    //    backboneRouterNavigateStub.restore();
    //});
    //
    //it('triggering a route without triggering the request function', function () {
    //    var url = 'my/testable/url';
    //    var backboneRouterNavigateStub = Sinon.stub(Router, 'navigate');
    //    Router.triggerRoute(url, {trigger: false});
    //    QUnit.deepEqual(backboneRouterNavigateStub.args[0], [url, {trigger: false}], 'on triggering route, Backbone.Routers\'s navigate method was called with correct args');
    //    backboneRouterNavigateStub.restore();
    //});
    //
    //it('navigating with getHistory()', function () {
    //    var $fixture = $('#qunit-fixture');
    //    $fixture.append('<div class="app-container"></div>'); // need app container
    //    var originalHash = window.location.hash;
    //    var firstUrl = 'my/testable/url';
    //    var appConfig = {
    //        pages: [
    //            {
    //                url: '^' + firstUrl  + '$',
    //                view: {
    //                    path: 'modules/verify/verify'
    //                },
    //                'css': ['modules/verify/verify']
    //            }
    //        ]
    //    };
    //    var appConfigInstance = {
    //        getConfig: Sinon.stub().returns(appConfig)
    //    };
    //    Router.start(appConfigInstance);
    //    QUnit.deepEqual(Router.getHistory()[0], {path: null}, 'getHistory() returns empty array because no urls were navigated to');
    //    Router.triggerRoute(firstUrl);
    //    QUnit.deepEqual(Router.getHistory()[1], {path: firstUrl}, 'after navigating to first url, calling getHistory() returns correct object');
    //    Router.reset();
    //    window.location.hash = originalHash;
    //});
    //
    //it('getting current url when a route hasnt yet been triggered', function () {
    //    var origHash = window.location.hash;
    //    window.location.hash = '#test/too';
    //    QUnit.equal(Router.getRelativeUrl(), 'test/too', 'calling getRelativeUrl() before triggering a route returns correct url');
    //    window.location.hash = origHash;
    //});
    //
    //it('getting current url params when a route hasnt yet been triggered', function () {
    //    var origHash = window.location.hash;
    //    window.location.hash = '#test';
    //    QUnit.deepEqual(Router.getRelativeUrlParams(), ['test'], 'calling getRelativeUrlParams() before triggering a route returns correct url');
    //    window.location.hash = origHash;
    //});

});
