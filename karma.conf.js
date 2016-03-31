// Karma configuration
// Generated on Mon Mar 14 2016 19:49:02 GMT+0800 (中国标准时间)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'public/ref/angular.min.js',

            'public/ref/angular-material.min.js',
            'public/ref/angular-animate.min.js',
            'public/ref/angular-aria.min.js',
            'public/ref/angular-messages.min.js',

            'public/ref/angular-route.min.js',
            'public/ref/angular-cookies.min.js',
            'public/ref/angular-sanitize.min.js',

            'public/ref/angular-mocks.js',
            'public/ref/tinymce/tinymce.min.js',
            'public/ref/angular-ui-tinymce.js',
            
            'public/js/**/*.js',

            'public/component/**/*.html',

            'karma/**/*.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'public/component/**/*.html': ['ng-html2js']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
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


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        //plugins
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
        ],

        ngHtml2JsPreprocessor: {
            // strip this from the file path
            // 去掉前缀, so public/a.html to a.html
            stripPrefix: 'public/',

            // - setting this option will create only a single module that contains templates
            //   from all the files, so you can load them all with module('foo')
            // - you may provide a function(htmlPath, originalPath) instead of a string
            //   if you'd like to generate modules dynamically
            //   htmlPath is a originalPath stripped and/or prepended
            //   with all provided suffixes and prefixes
            moduleName: 'nghtml2js'
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
