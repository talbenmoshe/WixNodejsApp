'use strict';

/**
 * Inject css/js files in index.ejs
 */

var gulp       = require('gulp');
var bowerFiles = require('main-bower-files');
var fileSort   = require('gulp-angular-filesort');
var inject     = require('gulp-inject');
var sq                   = require('streamqueue');

var toInject   = require('./config/indexFilesToInject');
var settingsToInject = require('./config/settingsFilesToInject');
var toExclude  = require('./config/bowerFilesToExclude');

function doInject (fileName,files,cssFileNames){
  //console.log('do js inject for ',fileName);


  return gulp.src(fileName)
    .pipe(gulp.dest('client'))
    .pipe(inject(gulp.src(bowerFiles(), { read: false }), {
      name: 'bower',
      relative: 'true',
      ignorePath: toExclude
    }))
    .pipe(inject(
      gulp.src(files).pipe(fileSort()), { relative: true }
    ))
    .pipe(inject(gulp.src(cssFileNames, { read: false}),{
      relative: true
    }))
    .pipe(gulp.dest('client'));
}


module.exports = function () {
  gulp.src('src/*.ejs')
    .pipe(gulp.dest('client'));
  doInject('src/index.ejs',toInject,'client/views/home/styles/*.css');

  return doInject('src/settings.ejs',settingsToInject,'client/views/settings/styles/*.css');

};
