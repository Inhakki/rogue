var config = require('./../config');

var filePaths = config.sources.map(function (source) {
    return config.srcDir + '/' + source + '.js';
});
filePaths.push('README.md');

module.exports = {
    dist : {
        options: {
            destination: 'api/current',
            private: false, // dont show private methods and variables
            template : "external/jsdoc",
            configure : "external/jsdoc/conf.json"
        },
        src: filePaths
    }

};