module.exports = {
    all: {
        options: {
            destPrefix: ""
        },
        files: {
            "external/require/require.js": "grunt-contrib-requirejs/node_modules/requirejs/require.js",
            "external/underscore/underscore.js": "underscore/underscore-min.js"
        }
    }
};