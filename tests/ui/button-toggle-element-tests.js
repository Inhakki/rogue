define([
    'sinon',
    'qunit',
    'test-utils',
    'framework/utils',
    'framework/ui/button-toggle-element'
],
    function(Sinon, QUnit, TestUtils, Utils, ButtonToggleElement){
        "use strict";

        QUnit.module('Button Toggle Element Tests');

        var html = '<label class="container"><input type="checkbox" class="ui-button-toggle-input" value="DC" name="state" />District Of Columbia</label>',
            selectedClass = 'ui-button-toggle-selected',
            disabledClass = 'ui-button-toggle-disabled',
            inputClass = 'ui-button-toggle-input',
            wrapperClass = 'ui-button-toggle';

        QUnit.test('initializing and destroying', function() {
            QUnit.expect(2);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName(inputClass)[0];
            var instance = new ButtonToggleElement({el: input});
            var toggle = container.getElementsByClassName(wrapperClass)[0];
            QUnit.ok(toggle.childNodes[0].isEqualNode(input), 'ui button toggle el was created with input element as its nested child');
            instance.destroy();
            QUnit.equal(input.parentNode, container, 'after destroy, input element\'s parent node is back to original');
        });

        QUnit.test('selecting and deselecting', function() {
            QUnit.expect(9);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName(inputClass)[0];
            var instance = new ButtonToggleElement({el: input});
            var toggle = container.getElementsByClassName(wrapperClass)[0];
            QUnit.ok(!Utils.hasClass(toggle, 'ui-button-toggle-selected'), 'toggle does not have active class initially');
            QUnit.equal(input.checked, false, 'input checked boolean returns false');
            QUnit.ok(!input.checked, 'input\'s checked boolean returns falsy');
            container.dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.ok(Utils.hasClass(toggle, 'ui-button-toggle-selected'), 'after click, active class has been added');
            QUnit.equal(input.checked, true, 'input checked boolean returns true');
            QUnit.ok(input.checked, 'input\'s checked boolean returns truthy');
            container.dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.ok(!Utils.hasClass(toggle, 'ui-button-toggle-selected'), 'after clicking again, toggle active class has been removed');
            QUnit.equal(input.checked, false, 'input checked boolean returns false');
            QUnit.ok(!input.checked, 'input\'s checked boolean returns falsy');
            instance.destroy();
        });

        QUnit.test('selecting and deselecting radio button toggles', function() {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var html = '<label><input type="radio" class="ui-button-toggle-input" value="Apple" name="fruit" checked="true" />Apple</label>';
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName(inputClass)[0];
            var instance = new ButtonToggleElement({el: input});
            var toggle = container.getElementsByClassName(wrapperClass)[0];
            QUnit.ok(Utils.hasClass(toggle, 'ui-button-toggle-selected'), 'toggle has correct active class initially because it was checked upon instantiation');
            QUnit.equal(input.checked, true, 'input checked boolean returns true');
            QUnit.ok(input.checked, 'input\'s checked boolean returns truthy');
            container.dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.ok(Utils.hasClass(toggle, 'ui-button-toggle-selected'), 'toggle still has active class even after clicking because it is a radio button');
            QUnit.equal(input.checked, true, 'input checked boolean returns true');
            QUnit.ok(input.checked, 'input\'s checked boolean returns truthy');
            instance.destroy();
        });

        QUnit.test('initializing and destroying when checked initially', function() {
            QUnit.expect(7);
            var container = Utils.createHtmlElement(html);
            var fixture = document.getElementById('qunit-fixture').appendChild(container);
            var input = container.getElementsByClassName(inputClass)[0];
            input.setAttribute('checked', 'checked'); // make it so that input is checked initially
            var onSelectedSpy = Sinon.spy();
            var setAttrSpy = Sinon.spy(input, 'setAttribute');
            var instance = new ButtonToggleElement({el: input, onSelected: onSelectedSpy});
            var toggle = container.getElementsByClassName(wrapperClass)[0];
            QUnit.equal(input.checked, true, 'input checked boolean returns true initially');
            QUnit.ok(Utils.hasClass(toggle, selectedClass), 'toggle has active class initially because original input was checked initially');
            QUnit.equal(setAttrSpy.callCount, 0, 'inputs attribute was NOT set to ensure no unnecessary change events are fired');
            QUnit.equal(onSelectedSpy.callCount, 0, 'onSelected callback was NOT fired');
            QUnit.equal(input.checked, true, 'input checked boolean returns true');
            container.dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.equal(input.checked, false, 'input checked boolean returns false');
            instance.destroy();
            QUnit.ok(input.checked, 'input checked boolean returns true because that\'s how it was initially');
            setAttrSpy.restore();
        });

        QUnit.test('selecting and deselecting callbacks', function() {
            QUnit.expect(4);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName(inputClass)[0];
            var onSelectedSpy = Sinon.spy();
            var onDeselectedSpy = Sinon.spy();
            var instance = new ButtonToggleElement({el: input, onSelected: onSelectedSpy, onDeselected: onDeselectedSpy});
            var toggle = container.getElementsByClassName(wrapperClass)[0];
            instance.select();
            QUnit.deepEqual(onSelectedSpy.args[0], [input.value, input, toggle], 'on check(), onChecked callback was fired with correct args');
            QUnit.equal(onDeselectedSpy.callCount, 0, 'onDeselected callback was NOT fired yet');
            instance.deselect();
            QUnit.deepEqual(onDeselectedSpy.args[0], [input.value, input, toggle], 'on uncheck(), onUnchecked callback was fired with correct args');
            QUnit.equal(onSelectedSpy.callCount, 1, 'onSelected callback was NOT fired');
            instance.destroy();
        });

        QUnit.test('checkbox toggle clicking on and off', function () {
            QUnit.expect(7);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName(inputClass)[0];
            var selectSpy = Sinon.spy(ButtonToggleElement.prototype, 'select');
            var deselectSpy = Sinon.spy(ButtonToggleElement.prototype, 'deselect');
            var instance = new ButtonToggleElement({el: input});
            var toggle = container.getElementsByClassName(wrapperClass)[0];
            QUnit.equal(selectSpy.callCount, 0, 'select() method was not called initially');
            QUnit.equal(deselectSpy.callCount, 0, 'deselect() method was not called initially');
            container.dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.equal(selectSpy.callCount, 1, 'clicking toggle calls select() method');
            QUnit.equal(deselectSpy.callCount, 0, 'deselect() method was not called');
            container.dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.equal(deselectSpy.callCount, 1, 'clicking toggle a second time calls deselect() method');
            QUnit.equal(selectSpy.callCount, 1, 'select() method was not called');
            instance.destroy();
            container.dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
            QUnit.equal(selectSpy.callCount, 1, 'clicking toggle again does NOT call select() method because instance was destroyed');
            selectSpy.restore();
            deselectSpy.restore();
        });

        QUnit.test('enabling and disabling', function () {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName(inputClass)[0];
            var instance = new ButtonToggleElement({el: input});
            var toggle = container.getElementsByClassName(wrapperClass)[0];
            QUnit.ok(!Utils.hasClass(toggle, disabledClass), 'toggle does not have active class initially');
            QUnit.ok(!input.disabled, 'input\'s checked boolean returns falsy');
            instance.disable();
            QUnit.ok(Utils.hasClass(toggle, disabledClass), 'toggle has correct disabled class after disable()');
            QUnit.ok(input.disabled, 'input\'s checked boolean returns truthy');
            instance.enable();
            QUnit.ok(!Utils.hasClass(toggle, disabledClass), 'after enable() toggle does not have disabled class');
            QUnit.ok(!input.disabled, 'input\'s checked boolean returns falsy');
            instance.destroy();
        });

        QUnit.test('initialize and destroy when initially disabled', function() {
            QUnit.expect(5);
            var container = Utils.createHtmlElement(html);
            var fixture = document.getElementById('qunit-fixture').appendChild(container);
            var input = container.getElementsByClassName(inputClass)[0];
            input.setAttribute('disabled', 'true'); // make it so that input is checked initially
            var setAttrSpy = Sinon.spy(input, 'setAttribute');
            var instance = new ButtonToggleElement({el: input});
            var toggle = container.getElementsByClassName(wrapperClass)[0];
            QUnit.ok(input.disabled, 'input was disabled initially');
            QUnit.ok(Utils.hasClass(toggle, disabledClass), 'toggle element has disabled class initially because original input was disabled initially');
            QUnit.equal(setAttrSpy.callCount, 0, 'setAttribute was NOT called to ensure no unnecessary change events are fired');
            instance.enable();
            QUnit.ok(!Utils.hasClass(toggle, disabledClass), 'when enabling, toggle element\'s disabled class is removed');
            instance.destroy();
            QUnit.ok(input.disabled, 'input disabled boolean returns true because that\'s how it was initially');
            setAttrSpy.restore();
        });


    });