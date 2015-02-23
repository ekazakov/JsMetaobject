module.exports = function(config) {
    config.set({

        // frameworks to use
        frameworks: [ 'mocha-debug', 'mocha', 'chai'],

        plugins: [
            'karma-mocha',
            'karma-mocha-debug',
            'karma-chai',
            'karma-mocha-reporter',
            'karma-chrome-launcher'
        ],
        // list of files / patterns to load in the browser
        files: [
            "js/index.js",
        ],

        // test results reporter to use
        // possible values: "dots", "progress", "junit", "growl", "coverage"
        reporters: ["mocha", 'spec'],

        // web server port
        port: 9876,
        // runnerPort : 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ["Chrome"],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 10000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
