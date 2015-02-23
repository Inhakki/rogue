(function() {
    'use strict';
}());

module.exports = function(grunt) {

    grunt.initConfig({

    });

    require('load-grunt-config')(grunt, {
        init: true,
        loadGruntTasks: {
            pattern: ['grunt-*']
        },
        data: {
            pkg: grunt.file.readJSON('package.json'),
            'gh-pages': {
                options: {
                    add: true
                },
                src: 'api/**/*'
            }
        }
    });

    // Default grunt
    grunt.registerTask('build', ['clean:all', 'copy:all', 'bt:build']);

    grunt.registerTask('server', ['connect:local']);

    grunt.registerTask('publish_api', ['jsdoc', 'copy:jsdoc', 'gh-pages', 'clean:jsdoc']);

    grunt.registerTask('test', ['bt:test']);

    grunt.task.registerTask('release', 'A custom release.', function(type) {
        type = type || 'patch';
        grunt.task.run([
            'bt:release' + type
        ]);
    });
};