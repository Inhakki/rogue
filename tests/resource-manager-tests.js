define([
    'sinon',
    'qunit',
    'src/rogue'
], function (
    Sinon,
    QUnit,
    Rogue
) {
    'use strict';

    var ResourceManager = Rogue.ResourceManager;

    QUnit.module('Resource Manager Tests');

    QUnit.test('loading multiple css files', function () {
        QUnit.expect(4);
        var cssPaths = [
            'test/path/to/css/one',
            'test/path/to/second/css'
        ];
        ResourceManager.loadCss(cssPaths);
        var head = document.getElementsByTagName('head')[0];
        QUnit.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'calling loadCss() with new css files loads first css path in the head of the document');
        QUnit.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second css path was loaded into the head of the document');
        ResourceManager.unloadCss(cssPaths);
        QUnit.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 0, 'calling unloadCss() removes first css path from the head of the document');
        QUnit.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 0, 'second css path is removed from the head of the document');
        ResourceManager.flush();
    });

    QUnit.test('loading a single css file', function () {
        QUnit.expect(2);
        var path = 'test/path/to/css/single.css';
        ResourceManager.loadCss(path);
        var head = document.getElementsByTagName('head')[0];
        QUnit.equal(head.querySelectorAll('link[href="' + path + '"]').length, 1, 'calling loadCss(), adds css in the head of the document');
        ResourceManager.unloadCss(path);
        QUnit.equal(head.querySelectorAll('link[href="' + path + '"]').length, 0, 'calling unloadCss() removes css from head of document');
        ResourceManager.flush();
    });

    QUnit.test('loading css files that have already been loaded', function () {
        QUnit.expect(5);
        var cssPaths = [
            'test/path/to/css/one',
            'test/path/to/second/css'
        ];
        var head = document.getElementsByTagName('head')[0];
        ResourceManager.loadCss(cssPaths);
        QUnit.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'on first loadCss() call, first file gets added to the head of the document once');
        QUnit.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second file gets added to the head of the document once');
        var newPath = 'test/new/third/file';
        cssPaths.push(newPath); // add new path
        ResourceManager.loadCss(cssPaths);
        QUnit.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'on second loadCss() call, first file does NOT get added to the head of the document a second time');
        QUnit.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second file does NOT get added to the head of the document a second time');
        QUnit.equal(head.querySelectorAll('link[href="' + newPath + '"]').length, 1, 'third file gets added to the head of the document because it was the only one of the files that hasnt been added yet');
        ResourceManager.flush();
    });

    QUnit.test('loading a javascript file', function () {
        QUnit.expect(6);
        var path = 'path/to/my.js';
        var head = document.getElementsByTagName('head')[0];
        var callbackSpy = Sinon.spy();
        ResourceManager.loadScript(path, callbackSpy);
        QUnit.equal(head.querySelectorAll('script[src="' + path + '"]').length, 1, 'on first loadScript() call, file gets added to the head of the document once');
        QUnit.equal(callbackSpy.callCount, 1, 'callback was fired');
        ResourceManager.loadScript(path, callbackSpy);
        QUnit.equal(head.querySelectorAll('script[src="' + path + '"]').length, 1, 'attempting to call loadScript() with the same path does not add it to the document a second time');
        QUnit.equal(callbackSpy.callCount, 2, 'callback was fired');
        ResourceManager.unloadScript(path, callbackSpy);
        QUnit.equal(head.querySelectorAll('script[src="' + path + '"]').length, 0, 'calling unloadScript() removes the path from the document head');
        QUnit.equal(callbackSpy.callCount, 3, 'callback was fired');
        ResourceManager.flush();
    });

    QUnit.test('loading multiple javascript files', function () {
        QUnit.expect(13);
        var paths = ['path/to/my/first/file.js', 'path/to/my/second/file.js'];
        var head = document.getElementsByTagName('head')[0];
        var callbackSpy = Sinon.spy();
        ResourceManager.loadScript(paths, callbackSpy);
        QUnit.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'on first loadScript() call, first file gets added to the head of the document once');
        QUnit.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'second file gets added to the head of the document once');
        QUnit.equal(callbackSpy.callCount, 1, 'callback was fired');
        ResourceManager.loadScript(paths[1], callbackSpy);
        QUnit.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'attempting to call loadScript() for second file again does not add it to the document a second time');
        QUnit.equal(callbackSpy.callCount, 2, 'callback was fired');
        ResourceManager.loadScript(paths[0], callbackSpy);
        QUnit.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'attempting to call loadScript() for first file again does not add it to the document a second time');
        QUnit.equal(callbackSpy.callCount, 3, 'callback was fired');
        ResourceManager.loadScript(paths, callbackSpy);
        QUnit.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'attempting to call loadScript() with an array of first and second files again does not add first file to the document a second time');
        QUnit.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'second file was not added to the document a second time');
        QUnit.equal(callbackSpy.callCount, 4, 'callback was fired');
        ResourceManager.unloadScript(paths, callbackSpy);
        QUnit.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 0, 'calling unloadScript() removes the first file from the document head');
        QUnit.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 0, 'second file is removed from the document head');
        QUnit.equal(callbackSpy.callCount, 5, 'callback was fired');
        ResourceManager.flush();
    });
});
