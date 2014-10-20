/* jshint unused: false, -W079 */
var require = {

    baseUrl: 'modules',
    paths: {
        utils: '../utils'
    },
    modules: [
        {
            name: "modal",
            deps: ["utils"]
        },
        {
            name: "tooltip",
            deps: ["utils"]
        }
    ]
};