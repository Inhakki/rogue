define([
    'sinon',
    'qunit',
    'framework/utils'
],
    function(Sinon, QUnit, Utils){
        "use strict";

        QUnit.module('Utils Tests');

        QUnit.test('adding and removing classes from an element', function() {
            QUnit.expect(3);
            var el = document.getElementById('qunit-fixture');
            var testClassName = 'testing';
            Utils.addClass(el, testClassName);
            QUnit.equal(el.className, testClassName, 'new class was added successfully');
            Utils.addClass(el, testClassName);
            QUnit.equal(el.className, testClassName, 'adding the same class a second time does not add the class name again');
            Utils.removeClass(el, testClassName);
            QUnit.equal(el.className, '', 'removing class was successful');
        });

        QUnit.test('adding and removing a class from an element when other classes already exist', function() {
            QUnit.expect(2);
            var testClass = 'test2';
            var fixture = document.getElementById('qunit-fixture');
            var el = document.createElement('div');
            fixture.appendChild(el);
            el.className = 'existingclass supercedingclass testing2';
            Utils.addClass(el, testClass);
            QUnit.ok(Utils.hasClass(el, testClass), 'target element has class initially');
            var result = 'existingclass supercedingclass testing2';
            Utils.removeClass(el, testClass);
            QUnit.equal(el.className, result, 'class was removed successfully, leaving all other existing classes in tact');
        });

        QUnit.test('createElement method', function() {
            QUnit.expect(3);
            var innerHtml = '<span>Test stuff</span>';
            var html = ' \n\r' +
                '<li class="testClass" data-more="more_data">' + innerHtml + '</li>';
            var el = Utils.createHtmlElement(html);
            QUnit.equal(el.tagName.toLowerCase(), 'li', 'passing html produces a new element with the correct tag name');
            QUnit.deepEqual(Utils.getElementAttrMap(el), {class: 'testClass', 'data-more': 'more_data'}, 'new element has correct attributes');
            QUnit.equal(el.innerHTML, innerHtml, 'new element has correct html contents');
        });

        QUnit.test('getClosestAncestorElementByClassName method', function() {
            QUnit.expect(3);
            var html = ' \n\r' +
                '<li class="ancestor" data-more="more_data">' +
                    '<div>' +
                        '<div class="test-child"></div>' +
                    '</div>' +
                '</li>';
            var el = Utils.createHtmlElement(html);
            var testChild = Utils.getElementsByClassName('test-child', el)[0];
            QUnit.equal(Utils.getClosestAncestorElementByClassName('ancestor', testChild), el, 'getting closest ancestor element returns correct element');
            QUnit.ok(!Utils.getClosestAncestorElementByClassName('nothing', testChild), 'returns falsy when no ancestors have the class specified');
            QUnit.ok(!Utils.getClosestAncestorElementByClassName('test-child', testChild), ' does NOT return the source element when attempting to get an ancestor element with the same class');
        });

    });