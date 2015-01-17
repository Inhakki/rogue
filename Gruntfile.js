(function() {
    'use strict';
}());

module.exports = function(grunt) {

    require('load-grunt-config')(grunt, {
        init: true,
        loadGruntTasks: {
            pattern: ['grunt-*']
        },
        data: {
            pkg: grunt.file.readJSON("package.json"),
            'gh-pages': {
                options: {
                    add: true
                },
                src: 'api/**/*'
            }
        }
    });

    // Default grunt
    grunt.registerTask( "build", ["clean", "copy:all"]);

    grunt.registerTask('server', ['connect:local']);

    grunt.registerTask('publish_api', ['jsdoc', 'copy:jsdoc', 'gh-pages']);

    grunt.registerTask('test', ['connect:test', 'qunit']);

    grunt.task.registerTask('release', 'A custom release.', function(type) {
        type = type || 'patch';
        grunt.task.run([
            'bump:' + type,
            'build',
            "uglify",
            "usebanner",
            "jsdoc"
        ]);
    });
};