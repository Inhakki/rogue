module.exports = {
    all: {
        files: ['src/rogue.js'],
        tasks: ['build']
    },
    jsdoc: {
        files: ['src/rogue.js', 'external/jsdoc/**/*'],
        tasks: ['jsdoc']
    }
};