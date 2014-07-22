if (typeof frameworkConfig === 'undefined') {
    console.error('web framework load error: no frameworkConfig is specified');
}

define(function () {
    return {
        config: frameworkConfig
    };
});