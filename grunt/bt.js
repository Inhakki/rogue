var config = require('./../config');

var compileFiles = function (suffix) {
    var files = {};
    suffix = suffix || '';
    config.sources.forEach(function (name) {
        files['build/' + name + suffix + '.js'] = ['src/' + name + '.js']
    });
    return files;
};


module.exports = {
    dist: 'build',
    browserify: {
        options: {
            browserifyOptions: {
                standalone: 'Rogue'
            }
        },
        files: compileFiles()
    },
    uglify: {
        files: compileFiles('-min')
    },
    tests: {
        mocha: {
            src: ['tests/*.js']
        }
    }
};