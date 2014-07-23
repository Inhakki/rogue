if (typeof frameworkConfig === 'undefined') {
    console.error('web framework load error: no frameworkConfig is specified');
}

// must require underscore immediately to make available to framework modules
define([frameworkConfig.modulePath + '/libs/underscore'], function () {
    return {
        config: frameworkConfig
    };
});