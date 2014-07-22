define([
    'sinon',
    'qunit',
    'workspace/utils'
],
    function(Sinon, QUnit, Utils){
        "use strict";

        QUnit.module('Utils Tests');

        QUnit.test('adding and removing classes from an element', function() {
            QUnit.expect(3);
            var el = document.getElementById('qunit-fixture');
            var testClassName = 'testing';
            var testResult = ' ' + testClassName;
            Utils.addClass(el, testClassName);
            QUnit.equal(el.className, testResult, 'new class was added successfully');
            Utils.addClass(el, testClassName);
            QUnit.equal(el.className, testResult, 'adding the same class a second time does not add the class name again');
            Utils.removeClass(el, testClassName);
            QUnit.equal(el.className, '', 'removing class was successful');
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

    });