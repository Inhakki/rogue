module.exports = {
    external: {
        files: [
            {
                src: 'bower_components/element-kit/dist/element-kit.js',
                dest: 'external/element-kit/element-kit.js'
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