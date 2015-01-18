module.exports = {
    dist : {
        options: {
            destination: 'api/current',
            private: false, // dont show private methods and variables
            template : "external/jsdoc",
            configure : "external/jsdoc/conf.json"
        }
    }

};