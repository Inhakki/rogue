
require.config({
    'baseUrl': '',
    'paths': {
        framework: '../../'
    }
});


require([
    'framework/framework',
    'framework/utils',
    'framework/ui/tooltip',
    'framework/ui/checkbox'
], function (App, Utils, Tooltip, Checkbox) {
    'use strict';

    var SampleView = function () {
        this.tooltip = new Tooltip({
            el: Utils.getElementsByClassName('ui-tooltip')[0]
        });

        this.checkbox = new Checkbox({
            el: Utils.getElementsByClassName('ui-checkbox')[0]
        });
    };

    return new SampleView();
});