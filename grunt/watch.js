module.exports = {
    all: {
        files : 'workspace',
        tasks : ['copy'],
        options: { livereload: true }
    },
    tests: {
        files : 'tests',
        tasks : ['copy:tests'],
        options: { livereload: true }
    }
};