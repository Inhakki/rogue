var sinon = require('sinon');
var TestUtils = require('test-utils');
var assert = require('assert');


describe('Resource Manager', function () {

    it('should load and unload multiple css files', function (done) {
        var ResourceManager = require('resource-manager');
        var cssPaths = ['test/path/to/css/one', 'test/path/to/second/css'];
        var request = require('./../src/request');
        ResourceManager.loadCss(cssPaths).then(function () {
            var head = document.getElementsByTagName('head')[0];
            assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'calling loadCss() with new css files loads first css path in the head of the document');
            assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second css path was loaded into the head of the document');
            ResourceManager.unloadCss(cssPaths).then(function (){
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 0, 'calling unloadCss() removes first css path from the head of the document');
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 0, 'second css path is removed from the head of the document');
                ResourceManager.flush();
                done();
            });
        });
    });

    it('should add and remove css file from DOM appropriately', function (done) {
        var path = 'test/path/to/css/single.css';
        var ResourceManager = require('resource-manager');
        ResourceManager.loadCss(path).then(function () {
            var head = document.getElementsByTagName('head')[0];
            assert.equal(head.querySelectorAll('link[href="' + path + '"]').length, 1, 'calling loadCss(), adds css in the head of the document');
            ResourceManager.unloadCss(path).then(function () {
                assert.equal(head.querySelectorAll('link[href="' + path + '"]').length, 0, 'calling unloadCss() removes css from head of document');
                ResourceManager.flush();
                done();
            });
        });
    });

    it('should NOT load css files that have already been loaded', function (done) {
        var cssPaths = ['test/path/to/css/one', 'test/path/to/second/css'];
        var head = document.getElementsByTagName('head')[0];
        var ResourceManager = require('resource-manager');
        ResourceManager.loadCss(cssPaths).then(function () {
            assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'on first loadCss() call, first file gets added to the head of the document once');
            assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second file gets added to the head of the document once');
            var newPath = 'test/new/third/file';
            cssPaths.push(newPath); // add new path
            ResourceManager.loadCss(cssPaths).then(function () {
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'on second loadCss() call, first file does NOT get added to the head of the document a second time');
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second file does NOT get added to the head of the document a second time');
                assert.equal(head.querySelectorAll('link[href="' + newPath + '"]').length, 1, 'third file gets added to the head of the document because it was the only one of the files that hasnt been added yet');
                ResourceManager.flush();
                done();
            });
        });
    });

    it('should inject a javascript file correctly into the DOM when loaded and remove when unloaded', function (done) {
        var path = 'path/to/my.js';
        var head = document.getElementsByTagName('head')[0];
        var scriptEl = document.createElement('script');
        var ResourceManager = require('resource-manager');
        var createScriptElementStub = sinon.stub(ResourceManager, 'createScriptElement').returns(scriptEl);
        sinon.stub(scriptEl, 'addEventListener').callsArg(1);
        ResourceManager.loadScript(path).then(function () {
            assert.equal(head.querySelectorAll('script[src="' + path + '"]').length, 1, 'on first loadScript() call, file gets added to the head of the document once');
            ResourceManager.loadScript(path).then(function () {
                assert.equal(head.querySelectorAll('script[src="' + path + '"]').length, 1, 'attempting to call loadScript() with the same path does not add it to the document a second time');
                ResourceManager.unloadScript(path).then(function () {
                    assert.equal(head.querySelectorAll('script[src="' + path + '"]').length, 0, 'calling unloadScript() removes the path from the document head');
                    ResourceManager.flush();
                    createScriptElementStub.restore();
                    done();
                });
            });
        });
    });

    it('should inject multiple javascript files into the DOM when loaded via same load call', function (done) {
        var paths = ['path/to/my/first/file.js', 'path/to/my/second/file.js'];
        var head = document.getElementsByTagName('head')[0];
        var firstScriptEl = document.createElement('script');
        var secondScriptEl = document.createElement('script');
        var ResourceManager = require('resource-manager');
        var createScriptElementStub = sinon.stub(ResourceManager, 'createScriptElement');
        createScriptElementStub.onFirstCall().returns(firstScriptEl);
        createScriptElementStub.onSecondCall().returns(secondScriptEl);
        sinon.stub(firstScriptEl, 'addEventListener').callsArg(1);
        sinon.stub(secondScriptEl, 'addEventListener').callsArg(1);
        ResourceManager.loadScript(paths).then(function () {
            assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'on first loadScript() call, first file gets added to the head of the document once');
            assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'second file gets added to the head of the document once');
            ResourceManager.loadScript(paths[1]).then(function () {
                assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'attempting to call loadScript() for second file again does not add it to the document a second time');
                ResourceManager.loadScript(paths[0]).then(function () {
                    assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'attempting to call loadScript() for first file again does not add it to the document a second time');
                    ResourceManager.loadScript(paths).then(function () {
                        assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'attempting to call loadScript() with an array of first and second files again does not add first file to the document a second time');
                        assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'second file was not added to the document a second time');
                        ResourceManager.unloadScript(paths).then(function () {
                            assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 0, 'calling unloadScript() removes the first file from the document head');
                            assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 0, 'second file is removed from the document head');
                            ResourceManager.flush();
                            createScriptElementStub.restore();
                            done();
                        });
                    });
                });
            });
        });
    });

    //it('loading a template file', function (done) {
    //    QUnit.expect(3);
    //    var path = 'path/to/template.html';
    //    var ResourceManager = require('resource-manager');
    //    var server = sinon.fakeServer.create();
    //    ResourceManager.loadTemplate(path).then(function () {
    //        ResourceManager.flush();
    //        done();
    //    });
    //    server.respondWith(200, { "Content-Type": "text/html" }, '<div></div>');
    //});
});
