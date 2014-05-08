module.exports = {
    dist : {
            src: [
                'src/*.js',
                'README.md'
            ],
            options: {
                destination: 'docs',
                template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'
            }
        }
};