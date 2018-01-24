// we can just use the exact same webpack config by requiring it
// however, remember to delete the original entry since we don't
// need it during tests
// karma.conf.js
module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        frameworks: ['jasmine'],        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        // this is the entry file for all our tests.
        files: ['spec/index.js'],
        // we will pass the entry file to webpack for bundling.
        preprocessors: {
            'spec/index.js': ['webpack']        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        },
        // use the webpack config
        //webpack: webpackConfig,
        webpackPreprocessor: {
            configPath: 'spec/webpack.test_config.js'
        },
        // avoid walls of useless text
        webpackMiddleware: {
            noInfo: true
        },
        singleRun: true,        // if true, Karma captures browsers, runs the tests and exits
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        concurrency: Infinity
    })
}