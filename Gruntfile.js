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

    // Default grunt
    grunt.registerTask( "build", [
        "clean",
        "copy",
        "requirejs"
    ]);
};