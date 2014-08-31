define([
    'sinon',
    'qunit',
    'test-utils',
    'framework/utils',
    'framework/ui/button-toggle',
    'framework/ui/button-toggle-element'
],
    function(Sinon, QUnit, TestUtils, Utils, ButtonToggle, ButtonToggleElement){
        "use strict";

        QUnit.module('Button Toggle Tests');

        var multiSelectHtml = '' +
            '<div class="container">' +
            '<label><input type="checkbox" class="ui-button-toggle-input" value="NY" name="state" />New York</label>' +
            '<label><input type="checkbox" class="ui-button-toggle-input" value="MD" name="state" />Maryland</label>' +
            '<label><input type="checkbox" class="ui-button-toggle-input" value="DC" name="state" />District Of Columbia</label>' +
            '</div>';

        var singleSelectHtml = '' +
            '<div class="container">' +
            '<label><input type="radio" class="ui-button-toggle-input" value="AAPL" name="stocks" />Apple</label>' +
            '<label><input type="radio" class="ui-button-toggle-input" value="FB" name="stocks" />Facebook</label>' +
            '<label><input type="radio" class="ui-button-toggle-input" value="VZ" name="stocks" />Verizon</label>' +
            '</div>';

        var toggleSelectedClass = 'ui-button-toggle-selected';

        QUnit.test('initializing/destroying (checkbox inputs)', function() {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(multiSelectHtml);
            fixture.appendChild(container);
            var toggleElementInitializeStub = Sinon.stub(ButtonToggleElement.prototype, 'initialize');
            var inputs = container.getElementsByClassName('ui-button-toggle-input');
            var instance = new ButtonToggle({container: container});
            var toggle = container.getElementsByClassName('ui-button-toggle')[0];

            var firstToggleElementDestroyStub = Sinon.stub(instance.getToggleElementMap()[0], 'destroy');
            var secondToggleElementDestroyStub = Sinon.stub(instance.getToggleElementMap()[1], 'destroy');
            var thirdToggleElementDestroyStub = Sinon.stub(instance.getToggleElementMap()[2], 'destroy');

            QUnit.equal(toggleElementInitializeStub.args[0][0].el, inputs[0], 'ButtonToggleElement was instantiated with el from first input');
            QUnit.equal(toggleElementInitializeStub.args[1][0].el, inputs[1], 'ButtonToggleElement was instantiated with el from second input');
            QUnit.equal(toggleElementInitializeStub.args[2][0].el, inputs[2], 'ButtonToggleElement was instantiated with el from third input');

            instance.destroy();

            QUnit.equal(firstToggleElementDestroyStub.callCount, 1, 'first ButtonToggleElement\'s destroy method was called on destroy');
            QUnit.equal(secondToggleElementDestroyStub.callCount, 1, 'second ButtonToggleElement\'s destroy method was called');
            QUnit.equal(thirdToggleElementDestroyStub.callCount, 1, 'third ButtonToggleElement\'s destroy method was called');

            firstToggleElementDestroyStub.restore();
            secondToggleElementDestroyStub.restore();
            thirdToggleElementDestroyStub.restore();
            toggleElementInitializeStub.restore();
        });

        QUnit.test('selecting and deselecting (checkbox inputs)', function() {
            QUnit.expect(3);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(multiSelectHtml);
            fixture.appendChild(container);
            var inputs = container.getElementsByClassName('ui-button-toggle-input');
            var onChangeSpy = Sinon.spy();
            var instance = new ButtonToggle({container: container, onChange: onChangeSpy});
            var toggles = container.getElementsByClassName('ui-button-toggle');

            toggles[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.deepEqual(onChangeSpy.args[0], [inputs[0].value, inputs[0], toggles[0]], 'onChange callback fired with correct args when first toggle item is clicked');
            toggles[1].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.deepEqual(onChangeSpy.args[1], [inputs[1].value, inputs[1], toggles[1]], 'onChange callback fired with correct args when second toggle item is clicked');
            toggles[2].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.deepEqual(onChangeSpy.args[2], [inputs[2].value, inputs[2], toggles[2]], 'onChange callback fired with correct args when third toggle item is clicked');
            instance.destroy();
        });

        QUnit.test('selecting and deselecting (radio button inputs)', function() {
            QUnit.expect(12);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(singleSelectHtml);
            fixture.appendChild(container);
            var inputs = container.getElementsByClassName('ui-button-toggle-input');
            var onChangeSpy = Sinon.spy();
            var instance = new ButtonToggle({container: container, onChange: onChangeSpy});
            var toggles = container.getElementsByClassName('ui-button-toggle');

            var firstToggleElementDeselectStub = Sinon.stub(instance.getToggleElementMap()[0], 'deselect');
            var secondToggleElementDeselectStub = Sinon.stub(instance.getToggleElementMap()[1], 'deselect');
            var thirdToggleElementDeselectStub = Sinon.stub(instance.getToggleElementMap()[2], 'deselect');

            toggles[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.deepEqual(onChangeSpy.args[0], [inputs[0].value, inputs[0], toggles[0]], 'onChange callback fired with correct args when first toggle item is clicked');
            QUnit.equal(firstToggleElementDeselectStub.callCount, 0, 'deselect() was NOT called on first instance');
            QUnit.equal(secondToggleElementDeselectStub.callCount, 1, 'deselect() was called on second instance');
            QUnit.equal(thirdToggleElementDeselectStub.callCount, 1, 'deselect() was called on third instance');

            toggles[1].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.deepEqual(onChangeSpy.args[1], [inputs[1].value, inputs[1], toggles[1]], 'onChange callback fired with correct args when second toggle item is clicked');
            QUnit.equal(firstToggleElementDeselectStub.callCount, 1, 'deselect() was called on first instance');
            QUnit.equal(secondToggleElementDeselectStub.callCount, 1, 'deselect() was NOT called on second instance');
            QUnit.equal(thirdToggleElementDeselectStub.callCount, 2, 'deselect() was called on third instance');

            toggles[2].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.deepEqual(onChangeSpy.args[2], [inputs[2].value, inputs[2], toggles[2]], 'onChange callback fired with correct args when third toggle item is clicked');
            QUnit.equal(firstToggleElementDeselectStub.callCount, 2, 'deselect() was called on first instance');
            QUnit.equal(secondToggleElementDeselectStub.callCount, 2, 'deselect() was called on second instance');
            QUnit.equal(thirdToggleElementDeselectStub.callCount, 2, 'deselect() was NOT called on third instance');

            firstToggleElementDeselectStub.restore();
            secondToggleElementDeselectStub.restore();
            thirdToggleElementDeselectStub.restore();
            instance.destroy();
        });

        QUnit.test('getElementKey()', function() {
            QUnit.expect(1);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(singleSelectHtml);
            var key = 'testKey';
            var buttonToggleElementGetElementKeyStub = Sinon.stub(ButtonToggleElement.prototype, 'getElementKey');
            buttonToggleElementGetElementKeyStub.returns(key);
            fixture.appendChild(container);
            var instance = new ButtonToggle({container: container});
            QUnit.equal(instance.getElementKey(), key, 'ButtonToggleElement\'s getElementKey() method was called and returned correct key');
            instance.destroy();
            buttonToggleElementGetElementKeyStub.restore();
        });

    });