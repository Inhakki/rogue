
require.config({
    'baseUrl': '',
    'paths': {
        framework: '../../workspace'
    }
});

require([
    'framework/framework',
    'framework/utils',
    'framework/ui/tooltip',
    'framework/ui/checkbox',
    'framework/ui/button-toggle',
    'framework/ui/input-field'
], function (App, Utils, Tooltip, Checkbox, ButtonToggle, InputField) {
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

        this.inputField = new InputField({
            el: Utils.getElementsByClassName('name-input-field')[0]
        });

    };

    return new SampleView();
});