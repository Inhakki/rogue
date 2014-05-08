module.exports = {
    options: {
        colors: true,
        coverageReporter: {
            dir : "coverage/",
            type : "html"
        },
        files: [
            "src/*.js"
        ],
        frameworks: [
            "jasmine"
        ],
        plugins: [
            "karma-jasmine",
            "karma-phantomjs-launcher",
            "karma-coverage"
        ],
        port: 9876,
        preprocessors: {
            "src/*.js": ["coverage"]
        },
        reporters: ["progress", "coverage"],
        runnerPort: 9100
    },
    continuous: {
        browsers: ["PhantomJS"],
        logLevel: "ERROR",
        singleRun: true
    }
};