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
            pkg: grunt.file.readJSON("package.json")
        }
    });

    // Default grunt
    grunt.registerTask( "build", ["clean", "copy"]);

    grunt.registerTask('server', ['connect:local', 'watch']);

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