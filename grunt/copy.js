module.exports = {
    main: {
        expand: true,
        cwd: 'workspace',
        src: ['**'],
        dest: 'build'
    },
    tests: {
        expand: true,
        cwd: 'tests',
        src: ['**'],
        dest: 'build/tests'
    }
};