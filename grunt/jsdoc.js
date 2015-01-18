module.exports = {
    dist : {
        src: ['src/**/*.js'],
        options: {
            destination: 'api/current',
            private: false, // dont show private methods and variables
            template : "node_modules/jaguarjs-jsdoc",
            configure : "external/jsdoc/conf.json"
        }
    }

};