module.exports = {
    dist: 'build',
    browserify: {
        options: {
            browserifyOptions: {
                standalone: 'Rogue'
            }
        },
        files: {
            'build/carousel.js': ['src/carousel.js'],
            'build/modal.js': ['src/modal.js'],
            'build/tooltip.js': ['src/tooltip.js']
        }
    },
    uglify: {
        files: {
            'build/carousel-min.js': ['build/carousel.js'],
            'build/modal-min.js': ['build/modal.js'],
            'build/tooltip-min.js': ['build/tooltip.js']
        }
    },
    tests: {
        mocha: {
            src: ['tests/*.js']
        }
    }
};