module.exports = {
    all: {
        options: {
            destPrefix: ""
        },
        files: {
            "external/require/require.js": "grunt-contrib-requirejs/node_modules/requirejs/require.js",
            "external/underscore/underscore.js": "underscore/underscore-min.js",
            "external/qunit/qunit.js": "qunitjs/qunit/qunit.js",
            "external/qunit/qunit.css": "qunitjs/qunit/qunit.css",
            "external/sinon": "sinon/lib",
            "external/element-kit/utils.js": "element-kit/dist/utils.js"
        }
    }
};