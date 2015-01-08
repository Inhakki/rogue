define([
    'sinon',
    'qunit',
    'test-utils',
    'build/rogue'
], function(
    Sinon,
    QUnit,
    TestUtils,
    Rogue
){
    "use strict";

    var fixture;

    QUnit.module('Carousel Tests');

    QUnit.test('showing panels', function () {
        QUnit.expect(7);
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var activeClass = 'carousel-panel-active';
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var panelChangeSpy = Sinon.spy();
        var carouselView = new Rogue.Carousel({
            panels: panels,
            onPanelChange: panelChangeSpy
        });
        QUnit.equal(carouselView.getCurrentIndex(), 0, 'getCurrentIndex() returns 0 on initialize');
        QUnit.ok(panels[0].classList.contains(activeClass), 'active class has been applied to first panel');
        QUnit.equal(panelChangeSpy.callCount, 0, 'onPanelChange callback was not fired since the first panel is assumed on init');
        carouselView.goToPanel(2); // go to second index
        QUnit.equal(carouselView.getCurrentIndex(), 2, 'after transitioning to second panel, getCurrentIndex() returns 2');
        QUnit.ok(panels[2].classList.contains(activeClass), 'active class has been applied to second panel');
        QUnit.ok(!panels[0].classList.contains(activeClass), 'active class has been removed from first panel');
        QUnit.deepEqual(panelChangeSpy.args[0], [2], 'onPanelChange callback was fired with the second index as its first argument');
        carouselView.destroy();
    });

    QUnit.test('showing a panel that is already showing', function () {
        QUnit.expect(6);
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var activeClass = 'carousel-panel-active';
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var panelChangeSpy = Sinon.spy();
        var carouselView = new Rogue.Carousel({
            panels: panels,
            onPanelChange: panelChangeSpy
        });
        carouselView.goToPanel(2);
        QUnit.deepEqual(panelChangeSpy.args[0], [2], 'after transitioning to second panel, onPanelChange callback was fired with the second index as its first argument');
        QUnit.equal(carouselView.getCurrentIndex(), 2, 'getCurrentIndex() returns 2');
        QUnit.ok(panels[2].classList.contains(activeClass), 'active class has been applied to second panel');
        carouselView.goToPanel(2);
        QUnit.equal(panelChangeSpy.callCount, 1, 'after going to the second panel again, onPanelChange callback was NOT fired twice');
        QUnit.equal(carouselView.getCurrentIndex(), 2, 'getCurrentIndex() still returns 2');
        QUnit.ok(panels[2].classList.contains(activeClass), 'second panel still has active class');
        carouselView.destroy();
    });

    QUnit.test('showing a panel that doesn\'t exists', function () {
        QUnit.expect(9);
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        var activeClass = 'carousel-panel-active';
        carouselEl.innerHTML =
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>' +
            '<div class="carousel-panel"></div>';

        var panels = carouselEl.getElementsByClassName('carousel-panel');
        var panelChangeSpy = Sinon.spy();
        var carouselView = new Rogue.Carousel({
            panels: panels,
            onPanelChange: panelChangeSpy
        });
        carouselView.goToPanel(2); // go to third panel
        QUnit.equal(carouselView.getCurrentIndex(), 2, 'after transitioning to third panel, getCurrentIndex() returns index of third panel');
        QUnit.ok(panels[2].classList.contains(activeClass), 'active class has been applied to third panel');
        QUnit.deepEqual(panelChangeSpy.args[0], [2], 'onPanelChange callback was fired with the third panel index as its first argument');
        carouselView.goToPanel(10); // go to panel of a index that is too high
        var firstPanelIndex = 0;
        QUnit.equal(carouselView.getCurrentIndex(), firstPanelIndex, 'after transitioning to a panel with an index that is too high, getCurrentIndex() returns index of first panel');
        QUnit.ok(panels[firstPanelIndex].classList.contains(activeClass), 'active class has been applied to first panel');
        QUnit.deepEqual(panelChangeSpy.args[1], [firstPanelIndex], 'onPanelChange callback was fired with the first panel index as its first argument');
        carouselView.goToPanel(-3); // go to panel of a index that is too low
        var lastPanelIndex = panels.length - 1;
        QUnit.equal(carouselView.getCurrentIndex(), lastPanelIndex, 'after transitioning to a panel with an index that is too low, getCurrentIndex() returns index of last panel');
        QUnit.ok(panels[lastPanelIndex].classList.contains(activeClass), 'active class has been applied to last panel');
        QUnit.deepEqual(panelChangeSpy.args[2], [lastPanelIndex], 'onPanelChange callback was fired with the last panel index as its first argument');
        carouselView.destroy();
    });

    QUnit.test('lazy loading single assets with NO panel', function () {
        QUnit.expect(6);
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<img class="carousel-item" src="blank.jpg" data-src="c1.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="c2.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="c3.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="c4.jpg" />' +
            '<img class="carousel-item" src="blank.jpg" data-src="c5.jpg" />';

        var origImage = window.Image;
        window.Image = Sinon.stub();

        var images = carouselEl.getElementsByTagName('img');
        var imageLoadingClass = 'carousel-asset-loading';
        var firstImageEl = {};
        window.Image.returns(firstImageEl);
        var carouselView = new Rogue.Carousel({
            panels: carouselEl.getElementsByTagName('img')
        });
        // test init (image 1)
        QUnit.ok(images[0].classList.contains(imageLoadingClass), 'after init, loading class was added to first image');
        QUnit.equal(firstImageEl.src, 'c1.jpg', 'first images\'s src attribute is replaced with the value of its lazy loading attribute');
        firstImageEl.onload(); // trigger third image load
        QUnit.ok(!images[0].classList.contains(imageLoadingClass), 'once first asset loads, its loading class is removed');
        // test image 3
        var thirdImageEl = {};
        window.Image.returns(thirdImageEl);
        carouselView.goToPanel(2);
        QUnit.ok(images[2].classList.contains(imageLoadingClass), 'going to third panel adds loading class');
        QUnit.equal(thirdImageEl.src, 'c3.jpg', 'third panel\'s src attribute is replaced with the value of its lazy loading attribute');
        thirdImageEl.onload(); // trigger third image load
        QUnit.ok(!images[2].classList.contains(imageLoadingClass), 'once third asset loads, the loading class is removed');
        carouselView.destroy();
        window.Image = origImage;
    });

    QUnit.test('lazy loading multiple assets contained inside a single panel', function () {
        QUnit.expect(6);
        var origImage = window.Image;
        window.Image = Sinon.stub();
        var fixture = document.getElementById('qunit-fixture');
        var carouselEl = document.createElement('div');
        carouselEl.innerHTML =
            '<div class="carousel-panel">' +
                '<img class="carousel-item" src="blank.jpg" data-src="c1.jpg" />' +
                '<img class="carousel-item" src="blank.jpg" data-src="c2.jpg" />' +
            '</div>' +
            '<div class="carousel-panel">' +
                '<img class="carousel-item" src="blank.jpg" data-src="c3.jpg" />' +
                '<img class="carousel-item" src="blank.jpg" data-src="c4.jpg" />' +
                '<img class="carousel-item" src="blank.jpg" data-src="c5.jpg" />' +
            '</div>';

        var firstImageEl = {};
        window.Image.onCall(0).returns(firstImageEl);
        var secondImageEl = {};
        window.Image.onCall(1).returns(secondImageEl);
        var carouselView = new Rogue.Carousel({
            panels: carouselEl.getElementsByClassName('carousel-panel'),
            assetClass: 'carousel-item'
        });
        var imageLoadingClass = 'carousel-asset-loading';
        var images = carouselEl.getElementsByTagName('img');
        // test init (image 1)
        QUnit.ok(images[0].classList.contains(imageLoadingClass), 'after init, loading class was added to first image');
        QUnit.ok(images[1].classList.contains(imageLoadingClass), 'loading class was added to second image');
        QUnit.equal(firstImageEl.src, 'c1.jpg', 'first images\'s src attribute is replaced with the value of its lazy loading attribute');
        QUnit.equal(secondImageEl.src, 'c2.jpg', 'second images\'s src attribute is replaced with the value of its lazy loading attribute');
        firstImageEl.onload(); // trigger image load
        secondImageEl.onload(); // trigger image load
        QUnit.ok(!images[0].classList.contains(imageLoadingClass), 'once first asset loads, its loading class is removed');
        QUnit.ok(!images[1].classList.contains(imageLoadingClass), 'once second asset loads, its loading class is removed');
        carouselView.destroy();
        window.Image = origImage;
    });

});