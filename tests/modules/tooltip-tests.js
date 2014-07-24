define([
    'sinon',
    'qunit',
    'framework/utils',
    'framework/ui/tooltip'
],
    function(Sinon, QUnit, Utils, Tooltip){
        "use strict";

        QUnit.module('Tooltip Tests');

        var html = '<div class="container"><span class="ui-tooltip-trigger"></span><div class="ui-tooltip-panel"></div></div>'

        QUnit.test('showing and hiding tooltip', function() {
            QUnit.expect(6);
            var fixture = document.getElementById('qunit-fixture');
            var el = Utils.createHtmlElement(html);
            var tooltip = new Tooltip({
                el: el,
                event: 'click'
            });
            var activeClass = 'ui-tooltip-active';
            QUnit.ok(!Utils.hasClass(el, activeClass), 'tooltip active class does not exist initially');
            QUnit.ok(!tooltip.isActive(), 'isActive() is falsy');
            tooltip.show();
            QUnit.ok(Utils.hasClass(el, activeClass), 'tooltip active class was added when calling show method');
            QUnit.ok(tooltip.isActive(), 'isActive() is truthy');
            tooltip.hide();
            QUnit.ok(!Utils.hasClass(el, activeClass), 'tooltip active class was removed when calling hide method');
            QUnit.ok(!tooltip.isActive(), 'isActive() is falsy');
        });

    });