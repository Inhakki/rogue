module.exports = {
    libs: {
        files: [
            {
                expand: true,
                cwd: 'bower_components/element-kit/dist',
                dest: 'src/libs/element-kit',
                src: ['element-kit.min.js']
            },
            {
                expand: true,
                cwd: 'bower_components/requirejs',
                dest: 'src/libs/require',
                src: ['require.js']
            },
            {
                expand: true,
                cwd: 'bower_components/underscore',
                dest: 'src/libs/underscore',
                src: ['underscore-min.js', 'underscore-min.map']
            },
            {
                expand: true,
                cwd: 'bower_components/formjs/dist',
                dest: 'src/libs/formjs',
                src: ['require.js']
            }
        ]
    },
    'test-libs': {
        files: [
            {
                expand: true,
                cwd: 'bower_components/qunit/qunit',
                dest: 'tests/libs/qunit',
                src: ['qunit.css', 'qunit.js']
            },
            {
                expand: true,
                cwd: 'bower_components/sinonjs',
                dest: 'tests/libs/sinon',
                src: ['sinon.js']
            }
        ]
    }

};