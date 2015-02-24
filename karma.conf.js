module.exports = function(config) {
    config.set({

        // frameworks to use
        frameworks: ['mocha', 'chai'],

        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-mocha-reporter',
            'karma-notify-reporter',
            'karma-chrome-launcher',
        ],

        // list of files / patterns to load in the browser
        files: [
            "js/index.js",
        ],

         client: {
             mocha: {
                 reporter: 'html', // change Karma's debug.html to the mocha web reporter
             }
         },

        reporters: ['progress', 'notify'],

        notifyReporter: {
            reportEachFailure: true, // Default: false, Will notify on every failed sepc
            reportSuccess: true, // Default: true, Will notify when a suite was successful
        },

        browsers: ["Chrome"],
    });
};
