module.exports = {
    external: {
        files: [
            {
                expand: true,
                cwd: 'bower_components/element-kit/src',
                src: '**/*',
                dest: 'external/element-kit'
            }
        ]
    },
    // copies then-current jsdoc api folder
    jsdoc: {
        files: [
            {
                expand: true,
                cwd: 'api/current',
                dest: 'api/<%= pkg.version %>',
                src: ['**/*']
            }
        ]
    }
};