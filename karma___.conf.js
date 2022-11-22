// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    webpack: {
      resolve: webpackConfig.resolve,
      module: _.extend({}, webpackConfig.module, {
          loaders: [
              {
                  test: /\.json$/,
                  loader: "json"
              },
              {
                  test: /\.s?css$/,
                  loader: 'ignore-loader'
              },
              {
                  test: /\.html$/,
                  loader: 'ignore-loader'
              }],
          postLoaders: [{ //delays coverage till tests are run, fixing transpiled source coverage error
              test: /[^(\-spec)^(\-mock)]\.js$/,
              exclude: /(node_modules)\//,
              loader: "istanbul-instrumenter"
          }]
      }),
      plugins: [
          new webpack.DefinePlugin(mockedConstants)
      ]
  }, 
  webpackServer: {
    noInfo: true //please don’t spam the console when running in karma!
  },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/onsystem-app'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    resolve: {
      fallback: {
          fs: false
      },
  }
  });
};



