module.exports = function (grunt) {
    var banner = '/** \n' +
        '* Rogue - v<%= pkg.version %>.\n' +
        '* <%= pkg.repository.url %>\n' +
        '* Copyright <%= grunt.template.today("yyyy") %>. Licensed MIT.\n' +
        '*/\n';
    return {
        all: {
            options: {
                banner: banner,
                    linebreak: false
            },
            files: {
                src: [
                    'dist/modal.js',
                    'dist/tooltip.js',
                    'dist/cache-manager.js'
                ]
            }
        }
    }
};