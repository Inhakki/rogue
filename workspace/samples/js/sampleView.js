
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
    'framework/ui/checkbox',
    'framework/ui/button-toggle'
], function (App, Utils, Tooltip, Checkbox, ButtonToggle) {
    'use strict';

    var SampleView = function () {
        this.tooltip = new Tooltip({
            el: Utils.getElementsByClassName('ui-tooltip')[0]
        });

        this.checkbox = new Checkbox({
            el: Utils.getElementsByClassName('ui-checkbox-input')[0]
        });

        this.multiSelectToggle = new ButtonToggle({
            container: Utils.getElementsByClassName('multi-select-button-toggle')[0]
        });

        this.singleSelectToggle = new ButtonToggle({
            container: Utils.getElementsByClassName('single-select-button-toggle')[0]
        });
    };

    return new SampleView();
});