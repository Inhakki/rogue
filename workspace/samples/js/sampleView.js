require([
    'framework/framework',
    'framework/utils',
    'framework/ui/tooltip'
], function (App, Utils, Tooltip) {
    'use strict';

    var SampleView = function () {
        this.tooltip = new Tooltip({
            el: Utils.getElementsByClassName('ui-tooltip')[0]
        });
    };

    return new SampleView();
});