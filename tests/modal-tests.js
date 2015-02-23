var Sinon = require('sinon');
var QUnit = require('qunit');
var TestUtils = require('test-utils');
var Modal = require('../src/modal');

module.exports = (function () {

    var modalsContainer;

    QUnit.module('Modal Tests', {
        setup: function () {
            var fixture = document.getElementById('qunit-fixture');
            modalsContainer = document.createElement('div');
            modalsContainer.className = 'modal-container';
        }
    });


    QUnit.test('initialization (with a modal container)', function () {
        QUnit.expect(3);
        var fixture = document.getElementById('qunit-fixture');
        var modalEl = document.createElement('div');
        var modalInstance = new Modal({
            containerEl: modalsContainer,
            el: modalEl
        });
        QUnit.ok(!modalsContainer.contains(modalEl), 'upon instantiation, modal element has NOT yet been added as a child node of the modal container because setup() has not been called');
        modalInstance.setup();
        QUnit.ok(modalsContainer.contains(modalEl), 'after setup() has been called, modal element has been added as a child node of the modal container');
        modalInstance.destroy();
        QUnit.ok(!modalsContainer.contains(modalEl), 'upon destruction, modal element has been removed as a child node of modal container');
    });

    QUnit.test('initialization (with NO modal container)', function () {
        QUnit.expect(3);
        var fixture = document.getElementById('qunit-fixture');
        var bodyEl = document.getElementsByTagName('body')[0];
        var modalEl = document.createElement('div');
        var modalInstance = new Modal({
            el: modalEl
        });
        QUnit.ok(!bodyEl.contains(modalEl), 'upon instantiation, modal element has NOT yet been added as a child node of the document body because setup() has not been called');
        modalInstance.setup();
        QUnit.ok(bodyEl.contains(modalEl), 'after setup() has been called, modal element has been added as a child node of document body');
        modalInstance.destroy();
        QUnit.ok(!bodyEl.contains(modalEl), 'upon destruction, modal element has been removed as a child node of document body');
    });

    QUnit.test('showing and hiding a modal', function () {
        QUnit.expect(8);
        var fixture = document.getElementById('qunit-fixture');
        var defaultActiveClass = 'modal-active';
        var defaultContainerActiveClass = 'modal-container-active';
        var modalEl = document.createElement('div');
        var modalInstance = new Modal({
            el: modalEl,
            containerEl: modalsContainer,
            activeClass: defaultActiveClass,
            containerActiveClass: defaultContainerActiveClass
        });
        modalInstance.setup();
        modalInstance.show();
        QUnit.ok(modalEl.classList.contains(defaultActiveClass), 'default active class was added to modal element after calling show()');
        QUnit.ok(modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was added to modal container calling show()');
        modalInstance.hide();
        QUnit.ok(!modalEl.classList.contains(defaultActiveClass), 'default active class was removed from modal element when hide() is called');
        QUnit.ok(!modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was removed from modal container');
        modalInstance.show();
        QUnit.ok(modalEl.classList.contains(defaultActiveClass), 'default active class was added back to modal element when show() is called again');
        QUnit.ok(modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was added to modal container');
        modalInstance.destroy();
        QUnit.ok(!modalEl.classList.contains(defaultActiveClass), 'default active class was removed from modal element when destroy() is called');
        QUnit.ok(!modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was removed from modal container');
    });

    QUnit.test('showing and hiding multiple modals with custom active classes', function () {
        QUnit.expect(12);
        var fixture = document.getElementById('qunit-fixture');
        var activeClass = 'my-custom-modal-active';
        var containerActiveClass = 'my-custom-modal-container-active';
        var firstModalEl = document.createElement('div');
        var secondModalEl = document.createElement('div');
        var firstModalInstance = new Modal({
            el: firstModalEl,
            containerEl: modalsContainer,
            activeClass: activeClass,
            containerActiveClass: containerActiveClass
        });
        var secondModalInstance = new Modal({
            el: secondModalEl,
            containerEl: modalsContainer,
            activeClass: activeClass,
            containerActiveClass: containerActiveClass
        });
        firstModalInstance.setup();
        secondModalInstance.setup();
        firstModalInstance.show();
        QUnit.ok(firstModalEl.classList.contains(activeClass), 'after calling show() on first modal, active class was added to it');
        QUnit.ok(!secondModalEl.classList.contains(activeClass), 'second modal does NOT yet have an active class');
        QUnit.ok(modalsContainer.classList.contains(containerActiveClass), 'active class was added to modal container');
        secondModalInstance.show();
        QUnit.ok(secondModalEl.classList.contains(activeClass), 'after calling show() on second modal, active class was added to it');
        QUnit.ok(firstModalEl.classList.contains(activeClass), 'first modal still now has its active class');
        QUnit.ok(modalsContainer.classList.contains(containerActiveClass), 'modal container still has active class');
        firstModalInstance.hide();
        QUnit.ok(!firstModalEl.classList.contains(activeClass), 'hiding first modal removes its active class');
        QUnit.ok(secondModalEl.classList.contains(activeClass), 'second modal still has its active class');
        QUnit.ok(modalsContainer.classList.contains(containerActiveClass), 'modal container still has active class because second modal hasnt been hidden yet');
        secondModalInstance.hide();
        QUnit.ok(!secondModalEl.classList.contains(activeClass), 'hiding second modal removes its active class');
        QUnit.ok(!firstModalEl.classList.contains(activeClass), 'first modal still does NOT have an active class');
        QUnit.ok(!modalsContainer.classList.contains(containerActiveClass), 'modal container\'s active class has been removed since there are modals showing');
        firstModalInstance.destroy();
        secondModalInstance.destroy();
    });

})();