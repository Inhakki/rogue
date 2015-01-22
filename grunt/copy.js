module.exports = {
    all: {
        files: [
            {
                expand: true,
                cwd: 'src',
                dest: 'build',
                src: ['rogue.js']
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