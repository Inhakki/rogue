var sinon = require('sinon');
var TestUtils = require('test-utils');
var Tooltip = require('../src/tooltip');
var assert = require('assert');

describe('Tooltip', function () {

    var el;

    before(function () {
        el = document.createElement('div');
        el.className = 'container';
        el.innerHTML = '<span class="ui-tooltip-trigger"></span><div class="ui-tooltip-panel"></div>';
    });

    after(function () {
        el = null;
    });

    it('should show and hide programmatically', function() {
        var fixture = document.getElementById('qunit-fixture');
        var tooltip = new Tooltip({el: el});
        var activeClass = 'ui-tooltip-active';
        assert.ok(!el.kit.classList.contains(activeClass), 'tooltip active class does not exist initially');
        assert.ok(!tooltip.isActive(), 'isActive() is falsy');
        tooltip.show();
        assert.ok(el.kit.classList.contains(activeClass), 'tooltip active class was added when calling show method');
        assert.ok(tooltip.isActive(), 'isActive() is truthy');
        tooltip.hide();
        assert.ok(!el.kit.classList.contains(activeClass), 'tooltip active class was removed when calling hide method');
        assert.ok(!tooltip.isActive(), 'isActive() is falsy');
        tooltip.destroy();
    });

    it('should show and hide when clicked', function() {
        var fixture = document.getElementById('qunit-fixture');
        var showSpy = sinon.spy(Tooltip.prototype, 'show');
        var showCallCount = 0;
        var hideSpy = sinon.spy(Tooltip.prototype, 'hide');
        var hideCallCount = 0;
        var tooltip = new Tooltip({el: el, showEvent: 'click', hideEvent: 'click'});
        var trigger = el.getElementsByClassName('ui-tooltip-trigger')[0];
        var panel = el.getElementsByClassName('ui-tooltip-panel')[0];
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT fired on init');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired on init');

        var clickEvent = TestUtils.createEvent('click');
        trigger.dispatchEvent(clickEvent);
        showCallCount++;
        assert.equal(showSpy.callCount, showCallCount, 'show method was fired after first click on trigger');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT called');
        var clickEvent = TestUtils.createEvent('click');
        trigger.dispatchEvent(clickEvent);
        hideCallCount++;
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was fired after second click on trigger');
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT called');
        tooltip.destroy();
        var clickEvent = TestUtils.createEvent('click');
        trigger.dispatchEvent(clickEvent);
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired after destroy');
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT fired');
        showSpy.restore();
        hideSpy.restore();
    });

    it('should NOT show and hide when no event options are specified', function() {
        var fixture = document.getElementById('qunit-fixture');
        var showSpy = sinon.spy(Tooltip.prototype, 'show');
        var hideSpy = sinon.spy(Tooltip.prototype, 'hide');
        var tooltip = new Tooltip({el: el});
        var trigger = el.getElementsByClassName('ui-tooltip-trigger')[0];
        var panel = el.getElementsByClassName('ui-tooltip-panel')[0];
        var clickEvent = TestUtils.createEvent('click');
        trigger.dispatchEvent(clickEvent);
        assert.equal(showSpy.callCount, 0, 'show method was NOT fired after click on trigger because no event was specified in init option');
        assert.equal(hideSpy.callCount, 0, 'hide method was NOT called');
        tooltip.destroy();
        showSpy.restore();
        hideSpy.restore();
    });

    it('should fire callback functions when showing and hiding', function() {
        var onShowSpy = sinon.spy();
        var onHideSpy = sinon.spy();
        var tooltip = new Tooltip({el: el, onShow: onShowSpy, onHide: onHideSpy});
        var trigger = el.getElementsByClassName('ui-tooltip-trigger')[0];
        tooltip.show();
        assert.equal(onShowSpy.callCount, 1, 'onShow callback is fired when tooltip shows');
        tooltip.hide();
        assert.equal(onHideSpy.callCount, 1, 'onHide callback is fired when tooltip hides');
        tooltip.destroy();
    });

    it('should show and hide on hover', function() {
        var fixture = document.getElementById('qunit-fixture');
        var showSpy = sinon.spy(Tooltip.prototype, 'show');
        var showCallCount = 0;
        var hideSpy = sinon.spy(Tooltip.prototype, 'hide');
        var hideCallCount = 0;
        var tooltip = new Tooltip({el: el, showEvent: 'mouseenter', hideEvent: 'mouseleave'});
        var trigger = el.getElementsByClassName('ui-tooltip-trigger')[0];
        var panel = el.getElementsByClassName('ui-tooltip-panel')[0];
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT fired on init');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired on init');
        var mouseInEvent = TestUtils.createEvent('mouseenter');
        trigger.dispatchEvent(mouseInEvent);
        showCallCount++;
        assert.equal(showSpy.callCount, showCallCount, 'show method was fired after hovering on trigger');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT called');
        var mouseOutEvent = TestUtils.createEvent('mouseleave');
        trigger.dispatchEvent(mouseOutEvent);
        hideCallCount++;
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was fired after mouse stops hovering trigger');
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT called');
        tooltip.destroy();
        showSpy.restore();
        hideSpy.restore();
    });

});