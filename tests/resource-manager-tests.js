define([
    'sinon',
    'qunit',
    'utilities/resource-manager',
    'jquery',
    'backbone'
], function (
    Sinon,
    QUnit,
    ResourceManager,
    $,
    Backbone
) {
    'use strict';

    QUnit.module('Resource Manager Tests');

    QUnit.test('loading css files', function () {
        QUnit.expect(1);
        var cssPaths = [
            'test/path/to/css/one',
            'test/path/to/second/css'
        ];
        var head = $('<head></head>')[0];
        var getHeadTagStub = Sinon.stub(ResourceManager, '_getHeadTag').returns(head);
        ResourceManager.loadCss(cssPaths);
        var renderedHtml = '<link href=\"test/path/to/css/one.css\" rel=\"stylesheet\"><link href=\"test/path/to/second/css.css\" rel=\"stylesheet\">';
        QUnit.equal(head.innerHTML, renderedHtml, 'calling loadCss() with new css files loads new css paths in the head tag of the document');
        ResourceManager.flush();
        getHeadTagStub.restore();
    });

    QUnit.test('loading css files that have already been loaded', function () {
        QUnit.expect(2);
        var cssPaths = [
            'test/path/to/css/one',
            'test/path/to/second/css'
        ];
        var head = $('<head></head>')[0];
        var getHeadTagStub = Sinon.stub(ResourceManager, '_getHeadTag').returns(head);
        ResourceManager.loadCss(cssPaths);
        var renderedHtml = '<link href=\"test/path/to/css/one.css\" rel=\"stylesheet\"><link href=\"test/path/to/second/css.css\" rel=\"stylesheet\">';
        QUnit.equal(head.innerHTML, renderedHtml, 'the appropriate html was rendered on first loadCss() call');
        var newPath = 'test/new/third/file';
        cssPaths.push(newPath); // add new path
        ResourceManager.loadCss(cssPaths);
        renderedHtml += '<link href=\"test/new/third/file.css\" rel=\"stylesheet\">';
        QUnit.equal(head.innerHTML, renderedHtml, 'calling loadCss() with files that have already been loaded does not add duplicates to the head tag of the document');
        ResourceManager.flush();
        getHeadTagStub.restore();
    });

    QUnit.test('loading a javascript (view) file', function () {
        QUnit.expect(2);
        var genericView =  Backbone.View;
        var origRequire = window.require;
        window.require = Sinon.stub().callsArgWith(1, genericView);
        var path = 'path/to/my/js';
        var loadPromiseSpy = Sinon.spy();
        ResourceManager.loadView(path).done(loadPromiseSpy);
        QUnit.equal(window.require.args[0][0], path, 'require() was fired with the correct javascript path');
        var renderedView = loadPromiseSpy.args[0][0];
        QUnit.deepEqual(renderedView.constructor, Backbone.View.prototype.constructor, 'load promise is resolved with an instantiated version of the js view');
        ResourceManager.flush();
        window.require = origRequire;
    });

    QUnit.test('loading a javascript (view) file that is a singleton', function () {
        QUnit.expect(1);
        var genericView =  new Backbone.View();
        var origRequire = window.require;
        window.require = Sinon.stub().callsArgWith(1, genericView);
        var path = 'path/to/my/js';
        var loadPromiseSpy = Sinon.spy();
        ResourceManager.loadView(path).done(loadPromiseSpy);
        var renderedView = loadPromiseSpy.args[0][0];
        QUnit.deepEqual(renderedView.constructor, Backbone.View.prototype.constructor, 'load promise is resolved with the view (without instantiating it) because it is a singleton');
        ResourceManager.flush();
        window.require = origRequire;
    });

    QUnit.test('loading same view file before original has finished', function () {
        QUnit.expect(6);
        var genericView =  new Backbone.View();
        var origRequire = window.require;
        window.require = Sinon.stub();
        var path = 'path/to/my/js';

        var firstRequestSpy = Sinon.spy();
        var secondRequestSpy = Sinon.spy();
        ResourceManager.loadView(path).done(firstRequestSpy);
        QUnit.equal(window.require.args[0][0], path, 'require() is called with correct args for the first load request');
        ResourceManager.loadView(path).done(secondRequestSpy);
        QUnit.equal(firstRequestSpy.callCount, 0, 'first request hasnt resolved because require callback has not been called');
        QUnit.equal(secondRequestSpy.callCount, 0, 'second request hasnt resolved because require callback has not been called');
        window.require.callArgWith(1, genericView);
        QUnit.deepEqual(firstRequestSpy.args[0], [genericView], 'first request resolves with correct view after require callback is fired');
        QUnit.equal(window.require.callCount, 1, 'require() is NOT called with the second load request');
        QUnit.deepEqual(secondRequestSpy.args[0], [genericView], 'second request resolves with correct view');

        ResourceManager.flush();
        window.require = origRequire;
    });

});
