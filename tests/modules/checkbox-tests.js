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

        var html = '<label><input type="checkbox" class="ui-checkbox" name="ny" /> New York</label>';

        QUnit.test('initializing/destroying the checkbox', function() {
            QUnit.expect(2);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName('ui-checkbox')[0];
            var checkbox = new Checkbox({el: input});
            var checkboxContainer = container.getElementsByClassName('ui-checkbox-container')[0];
            QUnit.ok(checkboxContainer.childNodes[0].isEqualNode(input), 'ui checkbox container was created with input element as its nested child');
            checkbox.destroy();
            QUnit.equal(input.parentNode, container, 'after destroy, input element\'s parent node is back to original');
        });

        QUnit.test('checking/unchecking checkbox', function() {
            QUnit.expect(9);
            var fixture = document.getElementById('qunit-fixture');
            var container = Utils.createHtmlElement(html);
            fixture.appendChild(container);
            var input = container.getElementsByClassName('ui-checkbox')[0];
            var checkbox = new Checkbox({el: input});
            var checkboxContainer = container.getElementsByClassName('ui-checkbox-container')[0];
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
            var input = container.getElementsByClassName('ui-checkbox')[0];
            input.setAttribute('checked', 'checked'); // make it so that input is checked initially
            var checkbox = new Checkbox({el: input});
            var checkboxContainer = container.getElementsByClassName('ui-checkbox-container')[0];
            QUnit.ok(input.checked, 'input was checked initially');
            QUnit.ok(Utils.hasClass(checkboxContainer, 'ui-checkbox-checked'), 'checkbox has active class initially because original input was checked initially');
            QUnit.ok(checkbox.isChecked(), 'isChecked() returns truthy');
            checkbox.uncheck();
            QUnit.ok(!checkbox.isChecked(), 'isChecked() returns falsy');
            checkbox.destroy();
            QUnit.ok(input.checked, 'input checked boolean returns true because that\'s how it was initially');
        });

    });