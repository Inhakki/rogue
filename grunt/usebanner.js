module.exports = function (grunt) {

    return {
        all: {
            options: {
                linebreak: false,
                banner: '/** \n' +
                '* Rogue - v<%= pkg.version %>.\n' +
                '* <%= pkg.repository.url %>\n' +
                '* Copyright <%= grunt.template.today("yyyy") %>. Licensed MIT.\n' +
                '*/\n'
            },
            files: {
                src: [
                    'build/modal.js',
                    'build/tooltip.js',
                    'build/cache-manager.js'
                ]
            }
        }
    }
};