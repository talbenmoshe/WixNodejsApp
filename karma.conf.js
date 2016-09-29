'use strict';

var bowerFilesToExclude = require('./tasks/config/bowerFilesToExclude.js');

module.exports = function (config) {
  config.set({

    basePath: 'src',

    frameworks: ['jasmine'],

    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'templates'
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    files: require('main-bower-files')({
      filter: function (path) {
        for (var i = 0; i < bowerFilesToExclude.length; i++) {
          if (!/\.js$/.test(path) || new RegExp(bowerFilesToExclude[i]).test(path)) { return false; }
        }
        return true;
      }
    })
      // .concat([
      //   'bower_components/angular-mocks/angular-mocks.js',
      //   'home/app.js',
      //   'views/**/*.js',
      //   'views/**/*.html',
      //   'services/**/*.js',
      //   'directives/**/*.js',
      //   'directives/**/*.html',
      //   'filters/**/*.js'
      // ]),
      .concat([
      'bower_components/angular-mocks/angular-mocks.js',

      'views/home/**/*.js',
      'views/home/**/*.html',
      'views/home/services/*.js',
      'views/home/directives/*.js',
      'views/home/directives/*.html',
      'views/home/filters/*.js'
    ]),

    exclude: [
      'views/**/*.e2e.js',
      'views/**/*.specs.js'
    ],

    reporters: ['progress'],

    port: 9876,

    colors: true,

    // possible values:
    // config.LOG_DISABLE
    // config.LOG_ERROR
    // config.LOG_WARN
    // config.LOG_INFO
    // config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['PhantomJS'],

    singleRun: true
  });
};
