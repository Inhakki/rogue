define([
    'sinon',
    'qunit',
    'test-utils',
    'framework/utils',
    'framework/ui/input-field'
],
    function(Sinon, QUnit, TestUtils, Utils, InputField){
        "use strict";

        QUnit.module('Input Field Tests');

        var disabledClass = 'ui-input-text-disabled';
        var activeClass = 'ui-input-text-active';
        var inputClass = 'ui-input-text-input';
        var containerClass = 'ui-input-text';
        var placeholderClass = 'ui-input-text-placeholder';

        var html = '<label class="container"><input type="text" class=' + inputClass + ' value="" placeholder="Enter your name" name="first_name" /></label>';

        QUnit.test('initializing and destroying', function() {
            QUnit.expect(2);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var inputEl = container.getElementsByClassName(inputClass)[0];
            var instance = new InputField({el: inputEl});
            var uiEl = container.getElementsByClassName(containerClass)[0];
            QUnit.ok(uiEl.childNodes[0].isEqualNode(inputEl), 'ui element was created with input element as its nested child');
            instance.destroy();
            QUnit.equal(inputEl.parentNode, container, 'after destroy, input element\'s parent node is back to original');
        });

        QUnit.test('focusing and blurring', function() {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var inputEl = container.getElementsByClassName(inputClass)[0];
            var instance = new InputField({el: inputEl});
            var uiEl = container.getElementsByClassName(containerClass)[0];
            QUnit.ok(!Utils.hasClass(uiEl, activeClass), 'input does not have active class initially');
            QUnit.notEqual(document.activeElement, inputEl, 'input does not have focus yet');
            inputEl.focus();
            QUnit.ok(Utils.hasClass(uiEl, activeClass), 'input now has active class after focus');
            QUnit.equal(document.activeElement, inputEl, 'input element currently has focus');
            inputEl.blur();
            QUnit.ok(!Utils.hasClass(uiEl, activeClass), 'input does not have active class after it loses focus');
            QUnit.notEqual(document.activeElement, inputEl, 'input element no longer has focus');
            instance.destroy();
        });

        QUnit.test('change callback firing', function() {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var inputEl = container.getElementsByClassName(inputClass)[0];
            var onChangeSpy = Sinon.spy();
            var instance = new InputField({el: inputEl, onChange: onChangeSpy});
            var uiEl = container.getElementsByClassName(containerClass)[0];
            QUnit.equal(inputEl.value, '', 'input value is empty initially');
            QUnit.equal(onChangeSpy.callCount, 0, 'onChange callback was NOT fired yet');
            inputEl.focus();
            var abra = 'abrahkadabraaa!';
            instance.setValue(abra);
            QUnit.equal(inputEl.value, abra, 'setting a custom value to input reflects that new input value');
            QUnit.deepEqual(onChangeSpy.args[0], [inputEl.value, inputEl, uiEl], 'onChange callback was fired with correct args');
            inputEl.blur();
            QUnit.equal(inputEl.value, abra, 'input value still has custom value after input blur');
            QUnit.equal(onChangeSpy.callCount, 1, 'onChange callback was NOT fired');
            instance.destroy();
        });

        QUnit.test('when native placeholder attribute is supported', function() {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var inputEl = container.getElementsByClassName(inputClass)[0];
            var instance = new InputField({el: inputEl});
            var uiEl = container.getElementsByClassName(containerClass)[0];
            QUnit.equal(inputEl.value, '', 'input value hasnt been set initially');
            QUnit.ok(!Utils.hasClass(uiEl, placeholderClass), 'placeholder class has not been set on ui element');
            inputEl.focus();
            QUnit.equal(inputEl.value, '', 'input value still hasnt been set after focus');
            QUnit.ok(!Utils.hasClass(uiEl, placeholderClass), 'placeholder class has not been set on ui element');
            inputEl.blur();
            QUnit.equal(inputEl.value, '', 'input value still hasnt been set after blur');
            QUnit.ok(!Utils.hasClass(uiEl, placeholderClass), 'placeholder class has not been set on ui element');
            instance.destroy();
        });

        QUnit.test('when native placeholder attribute is NOT supported', function() {
            QUnit.expect(15);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);

            var inputEl = container.getElementsByClassName(inputClass)[0];
            var isPlaceholderSupportedStub = Sinon.stub(InputField.prototype, 'isPlaceholderSupported').returns(false);
            var placeholder = 'test placeholder';
            var getPlaceholderStub = Sinon.stub(InputField.prototype, 'getPlaceholder').returns(placeholder);
            var onChangeSpy = Sinon.spy();
            var instance = new InputField({el: inputEl, onChange: onChangeSpy});
            var uiEl = container.getElementsByClassName(containerClass)[0];

            QUnit.equal(inputEl.value, placeholder, 'input placeholder has been set initially');
            QUnit.ok(Utils.hasClass(uiEl, placeholderClass), 'placeholder class has been set');
            QUnit.equal(onChangeSpy.callCount, 0, 'onChange callback was NOT fired');
            inputEl.focus();
            QUnit.equal(inputEl.value, '', 'input placholder has been removed on input focus');
            QUnit.ok(!Utils.hasClass(uiEl, placeholderClass), 'placeholder class has been removed');
            QUnit.equal(onChangeSpy.callCount, 0, 'onChange callback was NOT fired');
            inputEl.blur();
            QUnit.equal(inputEl.value, placeholder, 'input value has been set to placeholder text after input blur');
            QUnit.ok(Utils.hasClass(uiEl, placeholderClass), 'placeholder class was added');
            QUnit.equal(onChangeSpy.callCount, 0, 'onChange callback was NOT fired');
            inputEl.focus();
            var abra = 'abrahkadabra';
            instance.setValue(abra);
            QUnit.equal(inputEl.value, abra, 'setting a custom value to input reflects that new input value');
            QUnit.ok(!Utils.hasClass(uiEl, placeholderClass), 'placeholder class is still not present');
            QUnit.deepEqual(onChangeSpy.args[0], [inputEl.value, inputEl, uiEl], 'onChange callback was fired');
            inputEl.blur();
            QUnit.equal(inputEl.value, abra, 'input value still has custom value after input blur');
            QUnit.ok(!Utils.hasClass(uiEl, placeholderClass), 'placeholder class is still not preset');
            QUnit.equal(onChangeSpy.callCount, 1, 'onChange callback was NOT fired');
            instance.destroy();
            isPlaceholderSupportedStub.restore();
            getPlaceholderStub.restore();
        });

        QUnit.test('initializing and destroying when initial value is present', function() {
            QUnit.expect(3);
            var container = Utils.createHtmlElement(html);
            var fixture = document.getElementById('qunit-fixture').appendChild(container);
            var input = container.getElementsByClassName(inputClass)[0];
            var origValue = 'testy';
            input.value = origValue; // add custom value before initialization
            var instance = new InputField({el: input});
            var uiEl = container.getElementsByClassName(containerClass)[0];
            QUnit.equal(input.value, origValue, 'input has its initial value');
            var testValue2 = 'new testy';
            input.value = testValue2;
            QUnit.equal(input.value, testValue2, 'input has been set successfully');
            instance.destroy();
            QUnit.equal(input.value, origValue, 'after destroy, input returns the value that it was set to originally');
        });

        QUnit.test('enabling and disabling', function () {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var inputEl = container.getElementsByClassName(inputClass)[0];
            var instance = new InputField({el: inputEl});
            var uiEl = container.getElementsByClassName(containerClass)[0];
            QUnit.ok(!Utils.hasClass(uiEl, disabledClass), 'ui element does not have active class initially');
            QUnit.ok(!inputEl.disabled, 'input\'s disabled boolean returns falsy');
            instance.disable();
            QUnit.ok(Utils.hasClass(uiEl, disabledClass), 'ui element has correct disabled class after disable()');
            QUnit.ok(inputEl.disabled, 'input\'s disabled boolean returns truthy');
            instance.enable();
            QUnit.ok(!Utils.hasClass(uiEl, disabledClass), 'after enable() ui element does not have disabled class');
            QUnit.ok(!inputEl.disabled, 'input\'s disabled boolean returns falsy');
            instance.destroy();
        });

        QUnit.test('initialize and destroy when initially disabled', function() {
            QUnit.expect(5);
            var container = Utils.createHtmlElement(html);
            var fixture = document.getElementById('qunit-fixture').appendChild(container);
            var inputEl = container.getElementsByClassName(inputClass)[0];
            inputEl.setAttribute('disabled', 'true'); // make it so that input is checked initially
            var setAttrSpy = Sinon.spy(inputEl, 'setAttribute');
            var instance = new InputField({el: inputEl});
            var uiEl = container.getElementsByClassName(containerClass)[0];
            QUnit.ok(inputEl.disabled, 'input was disabled initially');
            QUnit.ok(Utils.hasClass(uiEl, disabledClass), 'ui element has disabled class initially because original input was disabled initially');
            QUnit.equal(setAttrSpy.callCount, 0, 'setAttribute was NOT called to ensure no unnecessary change events are fired');
            instance.enable();
            QUnit.ok(!Utils.hasClass(uiEl, disabledClass), 'when enabling, ui element\'s disabled class is removed');
            instance.destroy();
            QUnit.ok(inputEl.disabled, 'input disabled boolean returns true because that\'s how it was initially');
            setAttrSpy.restore();
        });


    });