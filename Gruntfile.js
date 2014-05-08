(function() {
    'use strict';
}());

module.exports = function(grunt) {
    require('load-grunt-config')(grunt, {

        init: true,

        loadGruntTasks: {
            pattern: ['grunt-*'],
        }
    });
};