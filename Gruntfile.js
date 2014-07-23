(function() {
    'use strict';
}());

module.exports = function(grunt) {

    require('load-grunt-config')(grunt, {
        init: true,
        loadGruntTasks: {
            pattern: ['grunt-*']
        }
    });

    grunt.loadNpmTasks('akqa-core');

    // add build-clean job
    grunt.config('build-clean', {
            all: {
                src: ['build/**']
            }
    });
};