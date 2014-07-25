define([
    'sinon',
    'qunit',
    'test-utils',
    'framework/utils',
    'framework/ui/tooltip'
],
    function(Sinon, QUnit, TestUtils, Utils, Tooltip){
        "use strict";

        QUnit.module('Tooltip Tests');

        var html = '<div class="container"><span class="ui-tooltip-trigger"></span><div class="ui-tooltip-panel"></div></div>'

        QUnit.test('showing and hiding tooltip', function() {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var el = Utils.createHtmlElement(html);
            var tooltip = new Tooltip({el: el});
            var activeClass = 'ui-tooltip-active';
            QUnit.ok(!Utils.hasClass(el, activeClass), 'tooltip active class does not exist initially');
            QUnit.ok(!tooltip.isActive(), 'isActive() is falsy');
            tooltip.show();
            QUnit.ok(Utils.hasClass(el, activeClass), 'tooltip active class was added when calling show method');
            QUnit.ok(tooltip.isActive(), 'isActive() is truthy');
            tooltip.hide();
            QUnit.ok(!Utils.hasClass(el, activeClass), 'tooltip active class was removed when calling hide method');
            QUnit.ok(!tooltip.isActive(), 'isActive() is falsy');
            tooltip.destroy();
        });

        QUnit.test('showing and hiding tooltip from click', function() {
            QUnit.expect(8);
            var fixture = document.getElementById('qunit-fixture');
            var el = Utils.createHtmlElement(html);
            var showSpy = Sinon.spy(Tooltip.prototype, 'show');
            var showCallCount = 0;
            var hideSpy = Sinon.spy(Tooltip.prototype, 'hide');
            var hideCallCount = 0;
            var tooltip = new Tooltip({el: el, showEvent: 'click', hideEvent: 'click'});
            var trigger = Utils.getElementsByClassName('ui-tooltip-trigger', el)[0];
            var panel = Utils.getElementsByClassName('ui-tooltip-panel', el)[0];
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

        QUnit.test('event handling when no event option is specified', function() {
            QUnit.expect(2);
            var fixture = document.getElementById('qunit-fixture');
            var el = Utils.createHtmlElement(html);
            var showSpy = Sinon.spy(Tooltip.prototype, 'show');
            var hideSpy = Sinon.spy(Tooltip.prototype, 'hide');
            var tooltip = new Tooltip({el: el});
            var trigger = Utils.getElementsByClassName('ui-tooltip-trigger', el)[0];
            var panel = Utils.getElementsByClassName('ui-tooltip-panel', el)[0];
            var clickEvent = TestUtils.createEvent('click');
            QUnit.equal(showSpy.callCount, 0, 'show method was NOT fired after click on trigger because no event was specified in init option');
            QUnit.equal(hideSpy.callCount, 0, 'hide method was NOT called');
            tooltip.destroy();
            showSpy.restore();
            hideSpy.restore();
        });

    });