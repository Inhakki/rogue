define([
    'sinon',
    'qunit',
    'test-utils',
    'framework/utils',
    'framework/ui/checkbox'
],
    function(Sinon, QUnit, TestUtils, Utils, Checkbox){
        "use strict";

        QUnit.module('Checkbox Tests');

        var html = '<label><input type="checkbox" class="ui-checkbox-input" value="NY" name="ny" /> New York</label>';
        var disabledClass = 'ui-checkbox-disabled';

        QUnit.test('initializing/destroying the checkbox', function() {
            QUnit.expect(2);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName('ui-checkbox-input')[0];
            var checkbox = new Checkbox({el: input});
            var checkboxContainer = container.getElementsByClassName('ui-checkbox')[0];
            QUnit.ok(checkboxContainer.childNodes[0].isEqualNode(input), 'ui checkbox container was created with input element as its nested child');
            checkbox.destroy();
            QUnit.equal(input.parentNode, container, 'after destroy, input element\'s parent node is back to original');
        });

        QUnit.test('checking/unchecking checkbox', function() {
            QUnit.expect(9);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName('ui-checkbox-input')[0];
            var checkbox = new Checkbox({el: input});
            var checkboxContainer = container.getElementsByClassName('ui-checkbox')[0];
            QUnit.ok(!Utils.hasClass(checkboxContainer, 'ui-checkbox-checked'), 'checkbox does not have active class initially');
            QUnit.ok(!checkbox.isChecked(), 'isChecked() returns falsy');
            QUnit.ok(!input.checked, 'input\'s checked boolean returns falsy');
            checkbox.check();
            QUnit.ok(Utils.hasClass(checkboxContainer, 'ui-checkbox-checked'), 'checkbox has correct active class after check()');
            QUnit.ok(checkbox.isChecked(), 'isChecked() returns truthy');
            QUnit.ok(input.checked, 'input\'s checked boolean returns truthy');
            checkbox.uncheck();
            QUnit.ok(!Utils.hasClass(checkboxContainer, 'ui-checkbox-checked'), 'after uncheck() checkbox does not have active class');
            QUnit.ok(!checkbox.isChecked(), 'isChecked() returns falsy');
            QUnit.ok(!input.checked, 'input\'s checked boolean returns falsy');
            checkbox.destroy();
        });

        QUnit.test('initializing/destroying when checked initially', function() {
            QUnit.expect(5);
            var container = Utils.createHtmlElement(html);
            var fixture = document.getElementById('qunit-fixture').appendChild(container);
            var input = container.getElementsByClassName('ui-checkbox-input')[0];
            input.setAttribute('checked', 'checked'); // make it so that input is checked initially
            var checkbox = new Checkbox({el: input});
            var checkboxContainer = container.getElementsByClassName('ui-checkbox')[0];
            QUnit.ok(input.checked, 'input was checked initially');
            QUnit.ok(Utils.hasClass(checkboxContainer, 'ui-checkbox-checked'), 'checkbox has active class initially because original input was checked initially');
            QUnit.ok(checkbox.isChecked(), 'isChecked() returns truthy');
            checkbox.uncheck();
            QUnit.ok(!checkbox.isChecked(), 'isChecked() returns falsy');
            checkbox.destroy();
            QUnit.ok(input.checked, 'input checked boolean returns true because that\'s how it was initially');
        });

        QUnit.test('checking/unchecking callbacks', function() {
            QUnit.expect(4);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName('ui-checkbox-input')[0];
            var onCheckedSpy = Sinon.spy();
            var onUncheckedSpy = Sinon.spy();
            var checkbox = new Checkbox({el: input, onChecked: onCheckedSpy, onUnchecked: onUncheckedSpy});
            var UICheckbox = container.getElementsByClassName('ui-checkbox')[0];
            checkbox.check();
            QUnit.deepEqual(onCheckedSpy.args[0], ['NY', input, UICheckbox], 'on check(), onChecked callback was fired with correct args');
            QUnit.equal(onUncheckedSpy.callCount, 0, 'onUnchecked callback was NOT fired yet');
            checkbox.uncheck();
            QUnit.deepEqual(onUncheckedSpy.args[0], ['NY', input, UICheckbox], 'on uncheck(), onUnchecked callback was fired with correct args');
            QUnit.equal(onCheckedSpy.callCount, 1, 'onChecked callback was NOT fired');
            checkbox.destroy();
        });

        QUnit.test('clicking on and off', function () {
            QUnit.expect(8);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName('ui-checkbox-input')[0];
            var checkSpy = Sinon.spy(Checkbox.prototype, 'check');
            var uncheckSpy = Sinon.spy(Checkbox.prototype, 'uncheck');
            var instance = new Checkbox({el: input});
            var checkboxEl = container.getElementsByClassName('ui-checkbox')[0];
            QUnit.equal(checkSpy.callCount, 0, 'check() method was not called initially');
            QUnit.equal(uncheckSpy.callCount, 0, 'uncheck() method was not called initially');
            checkboxEl.dispatchEvent(TestUtils.createEvent('click'));
            QUnit.equal(checkSpy.callCount, 1, 'clicking checkbox element calls check() method');
            QUnit.equal(uncheckSpy.callCount, 0, 'uncheck() method was not called');
            checkboxEl.dispatchEvent(TestUtils.createEvent('click'));
            QUnit.equal(uncheckSpy.callCount, 1, 'clicking checkbox element a second time calls uncheck() method');
            QUnit.equal(checkSpy.callCount, 1, 'check() method was not called');
            instance.destroy();
            checkboxEl.dispatchEvent(TestUtils.createEvent('click'));
            QUnit.equal(checkSpy.callCount, 1, 'clicking checkbox element again does NOT call check() method because instance was destroyed');
            QUnit.equal(uncheckSpy.callCount, 1, 'uncheck() method was not called');
            checkSpy.restore();
            uncheckSpy.restore();
        });

        QUnit.test('clicking on and off when disabled', function () {
            QUnit.expect(5);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName('ui-checkbox-input')[0];
            var checkSpy = Sinon.spy(Checkbox.prototype, 'check');
            var uncheckSpy = Sinon.spy(Checkbox.prototype, 'uncheck');
            var instance = new Checkbox({el: input});
            var checkboxEl = container.getElementsByClassName('ui-checkbox')[0];
            instance.disable(); //disable
            checkboxEl.dispatchEvent(TestUtils.createEvent('click'));
            QUnit.equal(checkSpy.callCount, 0, 'clicking checkbox element while its disabled does not call check() method');
            QUnit.equal(uncheckSpy.callCount, 0, 'clicking checkbox element while its disabled does not call uncheck() method');
            instance.enable();
            checkboxEl.dispatchEvent(TestUtils.createEvent('click'));
            QUnit.equal(checkSpy.callCount, 1, 'after enabling, clicking checkbox element calls check() method');
            checkboxEl.dispatchEvent(TestUtils.createEvent('click'));
            QUnit.equal(uncheckSpy.callCount, 1, 'clicking checkbox element a second time calls uncheck() method');
            QUnit.equal(checkSpy.callCount, 1, 'check() method was not called');
            instance.destroy();
            checkSpy.restore();
            uncheckSpy.restore();
        });

        QUnit.test('enabling and disabling', function () {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var inputEl = container.getElementsByClassName('ui-checkbox-input')[0];
            var instance = new Checkbox({el: inputEl});
            var checkboxEl = container.getElementsByClassName('ui-checkbox')[0];
            QUnit.ok(!Utils.hasClass(checkboxEl, disabledClass), 'checkbox element does not have active class initially');
            QUnit.ok(!inputEl.disabled, 'input\'s checked boolean returns falsy');
            instance.disable();
            QUnit.ok(Utils.hasClass(checkboxEl, disabledClass), 'checkbox element has correct disabled class after disable()');
            QUnit.ok(inputEl.disabled, 'input\'s checked boolean returns truthy');
            instance.enable();
            QUnit.ok(!Utils.hasClass(checkboxEl, disabledClass), 'after enable(), checkbox element does not have disabled class');
            QUnit.ok(!inputEl.disabled, 'input\'s checked boolean returns falsy');
            instance.destroy();
        });

        QUnit.test('initializing and destroying when disabled state already exists', function () {
            QUnit.expect(5);
            var container = Utils.createHtmlElement(html);
            var fixture = document.getElementById('qunit-fixture').appendChild(container);
            var inputEl = container.getElementsByClassName('ui-checkbox-input')[0];
            inputEl.setAttribute('disabled', 'disabled'); // make it so that input is checked initially
            var setAttrSpy = Sinon.spy(inputEl, 'setAttribute');
            var instance = new Checkbox({el: inputEl});
            var checkboxEl = container.getElementsByClassName('ui-checkbox')[0];
            QUnit.ok(inputEl.disabled, 'input was disabled initially');
            QUnit.ok(Utils.hasClass(checkboxEl, disabledClass), 'checkbox element has disabled class initially because original input was disabled initially');
            QUnit.equal(setAttrSpy.callCount, 0, 'setAttribute was NOT called to ensure no unnecessary change events are fired');
            instance.enable();
            QUnit.ok(!Utils.hasClass(checkboxEl, disabledClass), 'when enabling, checkbox element\'s disabled class is removed');
            instance.destroy();
            QUnit.ok(inputEl.disabled, 'input disabled boolean returns true because that\'s how it was initially');
            setAttrSpy.restore();
        });

    });