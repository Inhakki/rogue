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
    }
};