define([
    'sinon',
    'qunit',
    'tests/libs/test-utils',
    'external/element-kit/utils',
    'src/modules/tooltip'
],
    function(Sinon, QUnit, TestUtils, ElementUtils, Tooltip){
        "use strict";

        QUnit.module('Tooltip Tests');

        var html = '<div class="container"><span class="ui-tooltip-trigger"></span><div class="ui-tooltip-panel"></div></div>'

        QUnit.test('showing and hiding tooltip', function() {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var el = ElementUtils.createHtmlElement(html);
            var tooltip = new Tooltip({el: el});
            var activeClass = 'ui-tooltip-active';
            QUnit.ok(!ElementUtils.hasClass(el, activeClass), 'tooltip active class does not exist initially');
            QUnit.ok(!tooltip.isActive(), 'isActive() is falsy');
            tooltip.show();
            QUnit.ok(ElementUtils.hasClass(el, activeClass), 'tooltip active class was added when calling show method');
            QUnit.ok(tooltip.isActive(), 'isActive() is truthy');
            tooltip.hide();
            QUnit.ok(!ElementUtils.hasClass(el, activeClass), 'tooltip active class was removed when calling hide method');
            QUnit.ok(!tooltip.isActive(), 'isActive() is falsy');
            tooltip.destroy();
        });

        QUnit.test('showing and hiding tooltip from click', function() {
            QUnit.expect(8);
            var fixture = document.getElementById('qunit-fixture');
            var el = ElementUtils.createHtmlElement(html);
            var showSpy = Sinon.spy(Tooltip.prototype, 'show');
            var showCallCount = 0;
            var hideSpy = Sinon.spy(Tooltip.prototype, 'hide');
            var hideCallCount = 0;
            var tooltip = new Tooltip({el: el, showEvent: 'click', hideEvent: 'click'});
            var trigger = ElementUtils.getElementsByClassName('ui-tooltip-trigger', el)[0];
            var panel = ElementUtils.getElementsByClassName('ui-tooltip-panel', el)[0];
            QUnit.equal(showSpy.callCount, showCallCount, 'show method was NOT fired on init');
            QUnit.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired on init');

            var clickEvent = TestUtils.createEvent('click');
            trigger.dispatchEvent(clickEvent);
            showCallCount++;
            QUnit.equal(showSpy.callCount, showCallCount, 'show method was fired after first click on trigger');
            QUnit.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT called');
            var clickEvent = TestUtils.createEvent('click');
            trigger.dispatchEvent(clickEvent);
            hideCallCount++;
            QUnit.equal(hideSpy.callCount, hideCallCount, 'hide method was fired after second click on trigger');
            QUnit.equal(showSpy.callCount, showCallCount, 'show method was NOT called');
            tooltip.destroy();
            var clickEvent = TestUtils.createEvent('click');
            trigger.dispatchEvent(clickEvent);
            QUnit.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired after destroy');
            QUnit.equal(showSpy.callCount, showCallCount, 'show method was NOT fired');
            showSpy.restore();
            hideSpy.restore();
        });

        QUnit.test('clicking to show/hide tooltip when no event options are specified', function() {
            QUnit.expect(2);
            var fixture = document.getElementById('qunit-fixture');
            var el = ElementUtils.createHtmlElement(html);
            var showSpy = Sinon.spy(Tooltip.prototype, 'show');
            var hideSpy = Sinon.spy(Tooltip.prototype, 'hide');
            var tooltip = new Tooltip({el: el});
            var trigger = ElementUtils.getElementsByClassName('ui-tooltip-trigger', el)[0];
            var panel = ElementUtils.getElementsByClassName('ui-tooltip-panel', el)[0];
            var clickEvent = TestUtils.createEvent('click');
            trigger.dispatchEvent(clickEvent);
            QUnit.equal(showSpy.callCount, 0, 'show method was NOT fired after click on trigger because no event was specified in init option');
            QUnit.equal(hideSpy.callCount, 0, 'hide method was NOT called');
            tooltip.destroy();
            showSpy.restore();
            hideSpy.restore();
        });

        QUnit.test('showing and hiding tooltip with onShow and onHide callback options', function() {
            QUnit.expect(2);
            var el = ElementUtils.createHtmlElement(html);
            var onShowSpy = Sinon.spy();
            var onHideSpy = Sinon.spy();
            var tooltip = new Tooltip({el: el, onShow: onShowSpy, onHide: onHideSpy});
            var trigger = ElementUtils.getElementsByClassName('ui-tooltip-trigger', el)[0];
            tooltip.show();
            QUnit.equal(onShowSpy.callCount, 1, 'onShow callback is fired when tooltip shows');
            tooltip.hide();
            QUnit.equal(onHideSpy.callCount, 1, 'onHide callback is fired when tooltip hides');
            tooltip.destroy();
        });

        QUnit.test('showing and hiding tooltip from hover', function() {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var el = ElementUtils.createHtmlElement(html);
            var showSpy = Sinon.spy(Tooltip.prototype, 'show');
            var showCallCount = 0;
            var hideSpy = Sinon.spy(Tooltip.prototype, 'hide');
            var hideCallCount = 0;
            var tooltip = new Tooltip({el: el, showEvent: 'mouseenter', hideEvent: 'mouseleave'});
            var trigger = ElementUtils.getElementsByClassName('ui-tooltip-trigger', el)[0];
            var panel = ElementUtils.getElementsByClassName('ui-tooltip-panel', el)[0];
            QUnit.equal(showSpy.callCount, showCallCount, 'show method was NOT fired on init');
            QUnit.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired on init');
            var mouseInEvent = TestUtils.createEvent('mouseenter');
            trigger.dispatchEvent(mouseInEvent);
            showCallCount++;
            QUnit.equal(showSpy.callCount, showCallCount, 'show method was fired after hovering on trigger');
            QUnit.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT called');
            var mouseOutEvent = TestUtils.createEvent('mouseleave');
            trigger.dispatchEvent(mouseOutEvent);
            hideCallCount++;
            QUnit.equal(hideSpy.callCount, hideCallCount, 'hide method was fired after mouse stops hovering trigger');
            QUnit.equal(showSpy.callCount, showCallCount, 'show method was NOT called');
            tooltip.destroy();
            showSpy.restore();
            hideSpy.restore();
        });

    });