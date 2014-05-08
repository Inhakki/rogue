module.exports = {
    options: {
        drop_console: true,
        compress: true,
        report: 'min'
    },
    prod: {
        files: {
            "src/akqa.lib.resize-manager.min.js": "src/*.js"
        }
    }
};